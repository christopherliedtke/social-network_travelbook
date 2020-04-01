const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbUser, dbPw, dbName } = require("./secrets");
    db = spicedPg(`postgres:${dbUser}:${dbPw}@localhost:5432/${dbName}`);
}

module.exports.addUser = (firstName, lastName, email, password) => {
    const q = `
        INSERT INTO users (first_name, last_name, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const params = [firstName, lastName, email, password];

    return db.query(q, params);
};

module.exports.getUser = email => {
    const q = `
        SELECT *
        FROM users
        WHERE email = $1
    `;
    const params = [email];

    return db.query(q, params);
};

module.exports.addPasswordResetCode = (email, code) => {
    const q = `
        INSERT INTO password_reset_code (email, code)
        VALUES ($1, $2)
        RETURNING *
    `;
    const params = [email, code];

    return db.query(q, params);
};

module.exports.checkPasswordResetCode = (email, code) => {
    const q = `
        SELECT *
        FROM password_reset_code
        WHERE email = $1 AND code = $2 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
    `;
    const params = [email, code];

    return db.query(q, params);
};

module.exports.updatePassword = (email, password) => {
    const q = `
        UPDATE users SET password = $2
        WHERE email = $1
    `;
    const params = [email, password];

    return db.query(q, params);
};
