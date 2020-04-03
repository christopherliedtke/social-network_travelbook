const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const compression = require("compression");
const ses = require("./utils/ses");
const cryptoRandomString = require("crypto-random-string");
const db = require("./utils/db");
const { hash, compare } = require("./utils/bcrypt");
const s3 = require("./utils/s3");
const conf = require("./config");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

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
app.use(express.json());

app.use(express.static("./public"));

const cookieSession = require("cookie-session");
app.use(
    cookieSession({
        secret: "I'm always angry.",
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

const csurf = require("csurf");
app.use(csurf());

app.use((req, res, next) => {
    // res.set("x-frame-options", "DENY");
    res.cookie("mytoken", req.csrfToken());
    next();
});

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
                    req.session.userId = response.rows[0]["id"];
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

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.getUser(email)
        .then(response => {
            compare(password, response.rows[0].password)
                .then(result => {
                    if (result) {
                        req.session.userId = response.rows[0]["id"];
                        req.session.firstName = response.rows[0]["first_name"];
                        req.session.lastName = response.rows[0]["last_name"];
                        req.session.email = response.rows[0]["email"];
                        req.session.imageUrl = response.rows[0]["image_url"];
                        res.json({ success: true });
                    } else {
                        console.log("Password does not match!");
                        res.json({ success: false });
                    }
                })
                .catch(err => {
                    console.log("Error on compare() in POST to /login: ", err);
                    res.json({ success: false });
                });
        })
        .catch(err => {
            console.log("Error on getUser() in POST to /login: ", err);
            res.json({ success: false });
        });
});

app.post("/password/reset/start", (req, res) => {
    const secretCode = cryptoRandomString({
        length: 6
    });

    db.getUser(req.body.email)
        .then(response => {
            if (response.rows.length > 0) {
                //
                Promise.all([
                    db.addPasswordResetCode(req.body.email, secretCode),
                    ses.sendEmail(
                        "ggwoods@gmx.de",
                        "Your password reset for Travelbook",
                        `Please use the following code to reset your password on the Travelbook: ${secretCode}`
                    )
                ])
                    .then(() => {
                        res.json({ success: true });
                    })
                    .catch(err => {
                        console.log(
                            "Error on Promise.all() in POST to /password/reset/start: ",
                            err
                        );
                        res.json({ success: false });
                    });
            } else {
                res.json({ success: false });
            }
        })
        .catch(err => {
            console.log(
                "Error on getUser() in POST to /password/reset/start: ",
                err
            );
            res.json({ success: false });
        });
});

app.post("/password/reset/verify", (req, res) => {
    const { email, password, code } = req.body;

    db.checkPasswordResetCode(email, code)
        .then(response => {
            if (response.rows.length > 0) {
                hash(password)
                    .then(hashedPw => {
                        db.updatePassword(email, hashedPw)
                            .then(res.json({ success: true }))
                            .catch(err => {
                                console.log(
                                    "Error on updatePassword() on POST to /password/reset/verify: ",
                                    err
                                );
                                res.json({ success: false });
                            });
                    })
                    .catch(err => {
                        console.log(
                            "Error on hash() in POST to /password/reset/verify: ",
                            err
                        );
                        res.json({ success: false });
                    });
            } else {
                console.log("No valid email-code combination in db found!");
                res.json({ success: false });
            }
        })
        .catch(err => {
            console.log(
                "Error on checkPasswordResetCode() on POST to /password/reset/verify: ",
                err
            );
            res.json({ success: false });
        });
});

app.get("/user", async (req, res) => {
    const { email } = req.session;

    try {
        const response = await db.getUser(email);
        res.json(response.rows[0]);
    } catch (err) {
        console.log("Error on getUser() on POST to /user: ", err);
        res.json({ success: false });
    }
});

app.post(
    "/updateProfilePicture",
    uploader.single("file"),
    s3.upload,
    async (req, res) => {
        const url = conf.s3Url + req.file.filename;

        try {
            await db.updateImageUrl(req.session.email, url);
            res.json({ url, success: true });
        } catch (err) {
            console.log(
                "Error on updateImageUrl() on POST to /updateProfilePicture: ",
                err
            );
            res.json({ success: false });
        }
    }
);

app.post("/updateBio", async (req, res) => {
    try {
        await db.updateBio(req.session.email, req.body.bio);
        res.json({ success: true });
    } catch (err) {
        console.log("Error on updateBio() on POST to /updateBio: ", err);
        res.json({ success: false });
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.json({ success: true });
});

app.get("*", (req, res) => {
    if (req.session.userId) {
        res.sendFile(__dirname + "/index.html");
    } else {
        res.redirect("/welcome");
    }
});

app.listen(port, function() {
    console.log("-----> Server is listening...");
});
