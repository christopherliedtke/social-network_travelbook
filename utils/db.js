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
