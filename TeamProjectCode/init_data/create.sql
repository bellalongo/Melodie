CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password CHAR(60) NOT NULL,
    name VARCHAR(50), 
    display_image TEXT ,
    non_artist boolean 
);

CREATE TABLE snippets (
    snippet_id SERIAL PRIMARY KEY,
    track_id TEXT
);

CREATE TABLE friends (
    friend_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    name VARCHAR(50),
    display_image TEXT NOT NULL
);


CREATE TABLE users_to_snippets (
  user_id INT NOT NULL,
  snippet_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (user_id),
  FOREIGN KEY (snippet_id) REFERENCES snippets (snippet_id)

);


CREATE TABLE images (
  image_id SERIAL PRIMARY KEY NOT NULL,
  image_url VARCHAR(300) NOT NULL
);

CREATE TABLE users_to_images (
  image_id INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (image_id) REFERENCES images (image_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE users_to_friends (
  user_id INT NOT NULL,
  friend_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (user_id),
  FOREIGN KEY (friend_id) REFERENCES friends (friend_id)
);