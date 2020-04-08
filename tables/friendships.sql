DROP TABLE IF EXISTS friendships;


CREATE TABLE friendships(
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      sender_id INT NOT NULL REFERENCES users(id),
      receiver_id INT NOT NULL REFERENCES users(id),
      accepted BOOLEAN DEFAULT FALSE
 );