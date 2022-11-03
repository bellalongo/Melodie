CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password CHAR(60) NOT NULL,
    profile_picture image,
    name VARCHAR(50)
);

CREATE TABLE snippets (
    snippet_id SERIAL PRIMARY KEY,
    song_name TEXT,
    start_time TIME(fsp)
)
/*
CREATE TABLE friends (
    friend_id SERIAL PRIMARY KEY,
    username VARCHAR(60)
)
*/

CREATE TABLE users_to_snippets (
  user_id INT NOT NULL,
  snippet_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (user_id),
  FOREIGN KEY (snippet_id) REFERENCES snippets (snippets_id)

)