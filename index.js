const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    origins: "localhost:8080 travelbook-network.herokuapp.com:*",
}); // e.g. 'localhost:8080 travelbook.herokuapp.com:*'

let secrets, port;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
    port = process.env.PORT;
} else {
    secrets = require("./utils/secrets");
    port = 8080;
}

const compression = require("compression");
const cryptoRandomString = require("crypto-random-string");
const db = require("./utils/db");
const { hash, compare } = require("./utils/bcrypt");
const ses = require("./utils/ses");
const s3 = require("./utils/s3");
const conf = require("./config");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(compression());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
app.use(express.json());

app.use(express.static("./public"));

const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: secrets.COOKIE_SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});
app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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
        .then((hashedPw) => {
            db.addUser(firstName, lastName, email, hashedPw)
                .then((response) => {
                    req.session.userId = response.rows[0]["id"];
                    req.session.firstName = response.rows[0]["first_name"];
                    req.session.lastName = response.rows[0]["last_name"];
                    req.session.email = response.rows[0]["email"];
                    req.session.imageUrl = response.rows[0]["image_url"];
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log(
                        "Error on addUser() in POST to /register: ",
                        err
                    );
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("Error on hash() in POST to /register: ", err);
            res.json({ success: false });
        });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.getUser(email)
        .then((response) => {
            compare(password, response.rows[0].password)
                .then((result) => {
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
                .catch((err) => {
                    console.log("Error on compare() in POST to /login: ", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("Error on getUser() in POST to /login: ", err);
            res.json({ success: false });
        });
});

app.post("/password/reset/start", (req, res) => {
    const secretCode = cryptoRandomString({
        length: 6,
    });

    db.getUser(req.body.email)
        .then((response) => {
            if (response.rows.length > 0) {
                //
                Promise.all([
                    db.addPasswordResetCode(req.body.email, secretCode),
                    ses.sendEmail(
                        "ggwoods@gmx.de",
                        "Your password reset for Travelbook",
                        `Please use the following code to reset your password on the Travelbook: ${secretCode}`
                    ),
                ])
                    .then(() => {
                        res.json({ success: true });
                    })
                    .catch((err) => {
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
        .catch((err) => {
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
        .then((response) => {
            if (response.rows.length > 0) {
                hash(password)
                    .then((hashedPw) => {
                        db.updatePassword(email, hashedPw)
                            .then(res.json({ success: true }))
                            .catch((err) => {
                                console.log(
                                    "Error on updatePassword() on POST to /password/reset/verify: ",
                                    err
                                );
                                res.json({ success: false });
                            });
                    })
                    .catch((err) => {
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
        .catch((err) => {
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
        const openFriendRequests = await db.getNumberOpenFriendRequests(
            response.rows[0].id
        );

        const responseObj = {
            ...response.rows[0],
            ...openFriendRequests.rows[0],
        };

        res.json(responseObj);
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

app.post("/delete-picture", async (req, res) => {
    const fileName = req.body.imageUrl.split("/").slice(-1).join("");

    try {
        await s3.delete(fileName);
        res.json({ success: true });
    } catch (err) {
        console.log("Error on s3.delete() on POST to /delete-picture: ", err);
        res.json({ success: false });
    }
});

app.post("/updateBio", async (req, res) => {
    try {
        await db.updateBio(req.session.email, req.body.bio);
        res.json({ success: true });
    } catch (err) {
        console.log("Error on updateBio() on POST to /updateBio: ", err);
        res.json({ success: false });
    }
});

app.get("/user/:id.json", (req, res) => {
    if (req.params.id == req.session.userId) {
        res.json({ redirect: true });
    } else {
        db.getUserById(req.params.id)
            .then((response) => {
                if (response.rows[0]) {
                    res.json({ data: response.rows[0] });
                } else {
                    res.json({ redirect: true });
                }
            })
            .catch((err) => {
                console.log(
                    "Error on getUserById() on GET to /user/id:json: ",
                    err
                );
                res.json({ success: false });
            });
    }
});

app.get("/findPeople", async (req, res) => {
    try {
        let response;
        if (req.query.q == "") {
            response = await db.getNewestUsers();
        } else {
            response = await db.getUsersByName(req.query.q);
        }

        const responseObj = response.rows.filter((user) => {
            if (user.id != req.session.userId) {
                return user;
            }
        });

        res.json(responseObj);
    } catch (err) {
        console.log("Error on get*Users*() on GET to /findPeople: ", err);
        res.json({ success: false });
    }
});

app.get("/friendship-status/:id", async (req, res) => {
    try {
        const response = await db.checkFriendshipStatus(
            req.params.id,
            req.session.userId
        );

        if (response.rows[0]) {
            if (response.rows[0].accepted) {
                res.json({ status: "friend" });
            } else if (response.rows[0]["sender_id"] == req.session.userId) {
                res.json({ status: "sender" });
            } else {
                res.json({ status: "receiver" });
            }
        } else {
            res.json({ status: null });
        }
    } catch (err) {
        console.log(
            "Error on checkFriendshipStatus() on GET to /friendship-status/:id: ",
            err
        );
        res.json({ success: false });
    }
});

app.post("/make-friend-request/:id", async (req, res) => {
    try {
        await db.addFriendship(req.params.id, req.session.userId);
        res.json({ success: true });
    } catch (err) {
        console.log(
            "Error on addFriendship() on GET to /make-friend-request/:id: ",
            err
        );
        res.json({ success: false });
    }
});

app.post("/end-friendship/:id", async (req, res) => {
    try {
        await db.endFriendship(req.params.id, req.session.userId);
        res.json({ success: true });
    } catch (err) {
        console.log(
            "Error on endFriendship() on GET to /end-friendship/:id: ",
            err
        );
        res.json({ success: false });
    }
});

app.post("/accept-friend-request/:id", async (req, res) => {
    try {
        await db.acceptFriendship(req.session.userId, req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.log(
            "Error on acceptFriendship() on GET to /accept-friend-request/:id: ",
            err
        );
        res.json({ success: false });
    }
});

app.get("/friends-and-requests", async (req, res) => {
    const friends = await db.getFriendsRequests(req.session.userId);
    res.json(friends.rows);
});

app.post("/delete-account", async (req, res) => {
    const fileName = req.body.imageUrl.split("/").slice(-1).join("");
    const userId = req.session.userId;

    try {
        await s3.delete(fileName);
        await Promise.all[
            (db.deleteFriendships(userId),
            db.deleteChatMessages(userId),
            db.deleteUser(userId))
        ];
        req.session = null;
        res.json({ success: true });
    } catch (err) {
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

server.listen(port, function () {
    console.log(`-----> Server is listening to ${port}...`);
});

io.on("connection", async (socket) => {
    console.log(`-----> A socket with the id ${socket.id} connected.`);

    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    try {
        const allChatMessages = await db.getChatMessages();
        io.sockets.emit("chatMessages", allChatMessages.rows);
    } catch (err) {
        console.log("Error on getChatMessages(): ", err);
    }

    socket.on("addNewMessage", async (message) => {
        try {
            const messageId = await db.addNewMessage(userId, message);
            const newMessage = await db.getChatMessage(messageId.rows[0].id);
            io.sockets.emit("chatMessage", newMessage.rows[0]);
        } catch (err) {
            console.log("Error on addNewMessage(): ", err);
        }
    });

    socket.on("disconnect", () => {
        console.log(`-----> A socket with the id ${socket.id} disconnected.`);
    });
});
