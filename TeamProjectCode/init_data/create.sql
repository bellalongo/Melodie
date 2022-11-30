DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password CHAR(60) ,
    name VARCHAR(50)
);

DROP TABLE IF EXISTS snippets CASCADE;
CREATE TABLE snippets (
    snippet_id SERIAL PRIMARY KEY,
    track_id TEXT,
    song_name TEXT,
    start_time INT
);

DROP TABLE IF EXISTS friends CASCADE;
CREATE TABLE friends (
    friend_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password CHAR(60) NOT NULL,
    name VARCHAR(50)
);

DROP TABLE IF EXISTS posts CASCADE;
CREATE TABLE posts (
  post_id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  user_action TEXT,
  user_comment TEXT,
  song_name TEXT,
  song_artist TEXT,
  song_image TEXT
);

DROP TABLE IF EXISTS images CASCADE;
CREATE TABLE IF NOT EXISTS images (
  image_id SERIAL PRIMARY KEY NOT NULL,
  image_url VARCHAR(300) NOT NULL
);

DROP TABLE IF EXISTS users_to_posts CASCADE;
CREATE TABLE users_to_posts (
  user_id INT NOT NULL,
  post_id SERIAL NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(user_id),
  FOREIGN KEY(post_id) REFERENCES posts(post_id)
);

DROP TABLE IF EXISTS users_to_snippets CASCADE;
CREATE TABLE users_to_snippets (
  user_id INT NOT NULL,
  snippet_id SERIAL NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (user_id),
  FOREIGN KEY (snippet_id) REFERENCES snippets (snippet_id)
);

DROP TABLE IF EXISTS users_to_images CASCADE;
CREATE TABLE users_to_images (
  image_id INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (image_id) REFERENCES images (image_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id)
);

DROP TABLE IF EXISTS users_to_friends CASCADE;
CREATE TABLE users_to_friends (
  user_id INT NOT NULL,
  friend_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (user_id),
  FOREIGN KEY (friend_id) REFERENCES friends (friend_id)
);