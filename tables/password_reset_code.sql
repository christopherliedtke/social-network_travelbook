DROP TABLE IF EXISTS password_reset_code;


CREATE TABLE password_reset_code(
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email VARCHAR(255),
    code VARCHAR(6)
 );