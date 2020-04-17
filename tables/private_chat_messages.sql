DROP TABLE IF EXISTS private_chat_messages;


CREATE TABLE private_chat_messages(
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      sender_id INT NOT NULL REFERENCES users(id),
      receiver_id INT NOT NULL REFERENCES users(id),
      message TEXT NOT NULL
 );

 INSERT INTO private_chat_messages (sender_id, receiver_id, message)
 VALUES (205, 2, 'Hi, how is everyone doing?'), (2, 205, 'Doing good, how about you?'), (205, 2, 'Good as well, I am in Perth right now, how about you?'), (2, 205, 'Oh cool, I am in Darwin.'), (2, 61, 'Hi, I how are you?');