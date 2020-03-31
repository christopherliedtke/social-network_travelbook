const express = require("express");
const app = express();
const compression = require("compression");

app.use(compression());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

const db = require("./utils/db");

const { hash, compare } = require("./utils/bcrypt");

app.use(express.static("./public"));

app.use(express.json());

const cookieSession = require("cookie-session");
app.use(
    cookieSession({
        secret: "I'm always angry.",
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

// const csurf = require("csurf");
// app.use(csurf());

// app.use((req, res, next) => {
//     res.set("x-frame-options", "DENY");
//     res.locals.csrfToken = req.csrfToken();
//     next();
// });

app.get("/welcome", (req, res) => {
    if (!req.session.userId) {
        res.sendFile(__dirname + "/index.html");
    } else {
        res.redirect("/");
    }
});

app.post("/register", (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    hash(password)
        .then(hashedPw => {
            db.addUser(firstName, lastName, email, hashedPw)
                .then(response => {
                    req.session.userId = response.rows[0]["email"];
                    req.session.firstName = response.rows[0]["first_name"];
                    req.session.lastName = response.rows[0]["last_name"];
                    req.session.email = response.rows[0]["email"];
                    req.session.imageUrl = response.rows[0]["image_url"];

                    res.json({ success: true });
                })
                .catch(err => {
                    console.log(
                        "Error on addUser() in POST to /register: ",
                        err
                    );
                    res.json({ success: false });
                });
        })
        .catch(err => {
            console.log("Error on hash() in POST to /register: ", err);
            res.json({ success: false });
        });
});

app.get("*", (req, res) => {
    if (req.session.userId) {
        res.sendFile(__dirname + "/index.html");
    } else {
        res.redirect("/welcome");
    }
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
