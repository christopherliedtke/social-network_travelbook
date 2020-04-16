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

module.exports.getUser = (email) => {
    const q = `
        SELECT *
        FROM users
        WHERE email = $1
    `;
    const params = [email];

    return db.query(q, params);
};

module.exports.getUserById = (id) => {
    const q = `
        SELECT *
        FROM users
        WHERE id = $1
    `;
    const params = [id];

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

module.exports.updateImageUrl = (email, imgUrl) => {
    const q = `
        UPDATE users SET image_url = $2
        WHERE email = $1
    `;
    const params = [email, imgUrl];

    return db.query(q, params);
};

module.exports.updateBio = (email, bio) => {
    const q = `
        UPDATE users SET bio = $2
        WHERE email = $1
    `;
    const params = [email, bio];

    return db.query(q, params);
};

module.exports.getUsersByName = (searchString) => {
    const q = `
        SELECT id, first_name, last_name, image_url 
        FROM users
        WHERE first_name ILIKE $1 OR last_name ILIKE $1
        ORDER BY first_name
    `;
    const params = [searchString + "%"];

    return db.query(q, params);
};

module.exports.getNewestUsers = () => {
    const q = `
        SELECT id, first_name, last_name, image_url 
        FROM users
        ORDER BY id DESC
        LIMIT 9
    `;

    return db.query(q);
};

module.exports.checkFriendshipStatus = (reveiverId, senderId) => {
    const q = `
        SELECT * 
        FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1);
    `;
    const params = [reveiverId, senderId];

    return db.query(q, params);
};

module.exports.addFriendship = (reveiverId, senderId) => {
    const q = `
        INSERT INTO friendships (receiver_id, sender_id)
        VALUES ($1, $2)
        RETURNING *
    `;
    const params = [reveiverId, senderId];

    return db.query(q, params);
};

module.exports.acceptFriendship = (reveiverId, senderId) => {
    const q = `
        UPDATE friendships
        SET accepted = TRUE
        WHERE receiver_id = $1 AND sender_id = $2
        RETURNING *
    `;
    const params = [reveiverId, senderId];

    return db.query(q, params);
};

module.exports.endFriendship = (reveiverId, senderId) => {
    const q = `
        DELETE FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)
        RETURNING *
    `;
    const params = [reveiverId, senderId];

    return db.query(q, params);
};

module.exports.getFriendsRequests = (id) => {
    const q = `
        SELECT users.id, first_name, last_name, image_url, accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
    `;
    const params = [id];

    return db.query(q, params);
};

module.exports.getNumberOpenFriendRequests = (id) => {
    const q = `
        SELECT 
        COUNT (*)
        FROM friendships
        WHERE (receiver_id = $1 AND accepted = FALSE)
    `;
    const params = [id];

    return db.query(q, params);
};

module.exports.getChatMessages = () => {
    const q = `
        SELECT first_name, last_name, image_url, users.id AS user_id, chat_messages.created_at, message, chat_messages.id AS message_id
        FROM chat_messages
        JOIN users
        ON chat_messages.user_id = users.id
        ORDER BY chat_messages.created_at
    `;

    return db.query(q);
};

module.exports.addNewMessage = (id, message) => {
    const q = `
        INSERT INTO chat_messages (user_id, message)
        VALUES ($1, $2)
        RETURNING id
    `;
    const params = [id, message];

    return db.query(q, params);
};

module.exports.getChatMessage = (messageId) => {
    const q = `
        SELECT first_name, last_name, image_url, users.id AS user_id, chat_messages.created_at, message, chat_messages.id AS message_id
        FROM chat_messages
        JOIN users
        ON chat_messages.user_id = users.id
        WHERE chat_messages.id = $1
    `;
    const params = [messageId];

    return db.query(q, params);
};

module.exports.deleteFriendships = (id) => {
    const q = `
        DELETE FROM friendships
        WHERE sender_id = $1 OR receiver_id=$1
    `;
    const params = [id];

    return db.query(q, params);
};

module.exports.deleteChatMessages = (id) => {
    const q = `
        DELETE FROM chat_messages
        WHERE user_id = $1
    `;
    const params = [id];

    return db.query(q, params);
};

module.exports.deleteUser = (id) => {
    const q = `
        DELETE FROM users
        WHERE id = $1
    `;
    const params = [id];

    return db.query(q, params);
};
