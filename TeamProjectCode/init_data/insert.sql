-- INSERT INTO users (username, name, password) VALUES ('bellaa', 'Bella', 'wwokw'); /* ui: 1 */
-- INSERT INTO users (username, name, password) VALUES ('bella', 'Bella', 'eokfoekf'); /* ui: 2 */
-- INSERT INTO users (username, name, password) VALUES ('amy', 'Amy', 'wkwodkwod'); /* ui: 3 */
-- INSERT INTO users (username, name, password) VALUES ('frankIsCool', 'Frank', 'ekfjek'); /* ui: 4 */

INSERT INTO users (username,password, name,display_image, artist) VALUES ('drizzy', 'ovo', 'Drake','https://cdn.britannica.com/37/231937-050-9228ECA1/Drake-rapper-2019.jpg?w=400&h=300&c=crop', True);
INSERT INTO users (username,password, name,display_image, artist) VALUES ('lennox', 'dreamville', 'Ari Lennox', 'https://i.scdn.co/image/ab6761610000e5eb53c7c434d28939a0a966bc9f',True);
INSERT INTO users (username,password, name,display_image, artist) VALUES ('tswift', 'lovestory', 'Taylor Swift','https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0', True);
INSERT INTO users (username,password, name,display_image, artist) VALUES ('train', 'heysoulsister', 'Train','https://i.scdn.co/image/ab6761610000e5eb9ac5323dcebb1c7b80dcaf64', True);
INSERT INTO users (username,password, name,display_image, artist) VALUES ('kpop', 'stan', 'BTS','https://i.scdn.co/image/ab6761610000e5eb5704a64f34fe29ff73ab56bb', True);



INSERT INTO friends (username,name,display_image) VALUES ('thejadensnell', 'Jaden Snell', 'https://i.scdn.co/image/ab6775700000ee8573b7336d816fe320ee315643');
INSERT INTO friends (username,name,display_image) VALUES ('bellalongo', 'Bella Longo', 'https://www.shutterstock.com/image-photo/abstract-science-circle-global-network-connection-428771419');
INSERT INTO friends (username,name,display_image) VALUES ('alexbrim','Alex Brimhall', 'https://www.shutterstock.com/image-photo/coming-together-form-one-cropped-shot-2137445457');
INSERT INTO friends (username,name,display_image) VALUES ('gabosambo','Gabo Sambo', 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png');
INSERT INTO friends (username,name,display_image) VALUES ('caseyrudzki','Casey Rudski', 'https://play-lh.googleusercontent.com/eN0IexSzxpUDMfFtm-OyM-nNs44Y74Q3k51bxAMhTvrTnuA4OGnTi_fodN4cl-XxDQc');
INSERT INTO friends (username,name,display_image) VALUES ('daniilgarusov','Daniil Garusov', 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png');



INSERT INTO posts (username, user_action, user_comment, song_name, song_artist, song_image) VALUES ('thejadensnell', 'updated a snippet!','20/10 song','Charcoal Baby', 'Blood Orange', 'https://media.pitchfork.com/photos/5b7735baf60a9e325d3f01d5/1:1/w_600/blood%20orange_negro%20swan.jpg'); /* pi: 1*/
INSERT INTO posts (username, user_action, user_comment, song_name, song_artist, song_image) VALUES ('bellalongo', 'updated a snippet!','wowowowowow','Dazed and Confused', 'Led Zeppelin', 'https://upload.wikimedia.org/wikipedia/en/e/ef/Led_Zeppelin_-_Led_Zeppelin_%281969%29_front_cover.png'); /* pi: 2*/
INSERT INTO posts (username, user_action, user_comment, song_name, song_artist, song_image) VALUES ('bellalongo', 'updated a snippet!','good stuff','Love Yourz', 'J. Cole', 'https://m.media-amazon.com/images/I/41m7-eV+k-L._SY580_.jpg'); /* pi: 3*/
INSERT INTO posts (username, user_action, user_comment, song_name, song_artist, song_image) VALUES ('frankIsCool', 'updated a snippet!','cryin in the club','Self Control', 'Frank Ocean', 'https://upload.wikimedia.org/wikipedia/en/a/a0/Blonde_-_Frank_Ocean.jpeg'); /* pi: 4*/

INSERT INTO users_to_posts(user_id, post_id) VALUES ('2', '1');
INSERT INTO users_to_posts(user_id, post_id) VALUES ('2', '2');

INSERT INTO users_to_friends(user_id, friend_id) VALUES ('1', '1'); 
INSERT INTO users_to_friends(user_id, friend_id) VALUES ('1', '2');
INSERT INTO users_to_friends(user_id, friend_id) VALUES ('1', '3');

