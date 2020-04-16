DROP TABLE IF EXISTS chat_messages;


CREATE TABLE chat_messages(
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      user_id INT NOT NULL REFERENCES users(id),
      message TEXT NOT NULL
 );

 INSERT INTO chat_messages (user_id, message)
 VALUES (10, 'Hi, how is everyone doing?'), (46, 'Doing good, how about you? Where are you guys?'), (10, 'Good as well, I am in Perth right now, how about you?'), (46, 'Oh cool, I am in Darwin.'), (89, 'Hi, I am in Perth as well. What are you doing around here?');