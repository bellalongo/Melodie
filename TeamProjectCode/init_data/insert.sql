
INSERT INTO users (username,password, name,display_image, non_artist) VALUES ('drizzy', 'ovo', 'Drake','https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png', False);
INSERT INTO users (username,password, name,display_image, non_artist) VALUES ('lennox', 'dreamville', 'Ari Lennox', 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png',False);
INSERT INTO users (username,password, name,display_image, non_artist) VALUES ('tswift', 'lovestory', 'Taylor Swift','https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png', False);
INSERT INTO users (username,password, name,display_image, non_artist) VALUES ('train', 'heysoulsister', 'Train','https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png', False);
INSERT INTO users (username,password, name,display_image, non_artist) VALUES ('kpop', 'stan', 'BTS','https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png', False);
INSERT INTO users (username,password, name,display_image, non_artist) VALUES ('thedeclanmckenna', 'brazil', 'Declan Mckenna','https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png', False);
INSERT INTO users (username,password, name,display_image, non_artist) VALUES ('frank', 'chanel', 'Frank Ocean','https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png', False);
INSERT INTO users (username,password, name,display_image, non_artist) VALUES ('halloates', 'smilesara', 'Hall & Oates','https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png', False);
INSERT INTO users (username,password, name,display_image, non_artist) VALUES ('jidsv', 'dancenow', 'JID', 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png',False);
INSERT INTO users (username,password, name,display_image, non_artist) VALUES ('zay', '4rdasquaw', 'Isaiah Rashad','https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png', False);



INSERT INTO friends (username,name,display_image) VALUES ('thejadensnell', 'Jaden Snell', 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png');
INSERT INTO friends (username,name,display_image) VALUES ('bellalongo', 'Bella Longo', 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png');
INSERT INTO friends (username,name,display_image) VALUES ('alexbrimhall','Alex Brimhall', 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png');
INSERT INTO friends (username,name,display_image) VALUES ('gabosambo','Gabo Sambo', 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png');
INSERT INTO friends (username,name,display_image) VALUES ('caseyrudski','Casey Rudski', 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png');
INSERT INTO friends (username,name,display_image) VALUES ('daniilgarusov','Daniil Garusov', 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png');


INSERT INTO users (username, name, password) VALUES ('bellaa', 'Bella', 'wwokw'); /* ui: 1 */
INSERT INTO users (username, name, password) VALUES ('bella', 'Bella', 'eokfoekf'); /* ui: 2 */
INSERT INTO users (username, name, password) VALUES ('amy', 'Amy', 'wkwodkwod'); /* ui: 3 */
INSERT INTO users (username, name, password) VALUES ('frankIsCool', 'Frank', 'ekfjek'); /* ui: 4 */

INSERT INTO posts (username, user_action, user_comment, song_name, song_artist, song_image) VALUES ('bella', 'updated a snippet!','20/10 song','Charcoal Baby', 'Blood Orange', 'https://media.pitchfork.com/photos/5b7735baf60a9e325d3f01d5/1:1/w_600/blood%20orange_negro%20swan.jpg'); /* pi: 1*/
INSERT INTO posts (username, user_action, user_comment, song_name, song_artist, song_image) VALUES ('amy', 'updated a snippet!','wowowowowow','Dazed and Confused', 'Led Zeppelin', 'https://upload.wikimedia.org/wikipedia/en/e/ef/Led_Zeppelin_-_Led_Zeppelin_%281969%29_front_cover.png'); /* pi: 2*/
INSERT INTO posts (username, user_action, user_comment, song_name, song_artist, song_image) VALUES ('amy', 'updated a snippet!','good stuff','Love Yourz', 'J. Cole', 'https://m.media-amazon.com/images/I/41m7-eV+k-L._SY580_.jpg'); /* pi: 3*/
INSERT INTO posts (username, user_action, user_comment, song_name, song_artist, song_image) VALUES ('frankIsCool', 'updated a snippet!','cryin in the club','Self Control', 'Frank Ocean', 'https://upload.wikimedia.org/wikipedia/en/a/a0/Blonde_-_Frank_Ocean.jpeg'); /* pi: 4*/

INSERT INTO friends (username, password,display_image) VALUES ('bella', 'eokfoekf','https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png); /* fi: 1 */
INSERT INTO friends (username, password,display_image) VALUES ('amy', 'eokfoekf','https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png); /* fi: 2 */
INSERT INTO friends (username, password,display_image) VALUES ('frankIsCool', 'eokfoekf','https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png); /* fi: 3 */

INSERT INTO users_to_posts(user_id, post_id) VALUES ('2', '1');
INSERT INTO users_to_posts(user_id, post_id) VALUES ('2', '2');

INSERT INTO users_to_friends(user_id, friend_id) VALUES ('1', '1'); 
INSERT INTO users_to_friends(user_id, friend_id) VALUES ('1', '2');
INSERT INTO users_to_friends(user_id, friend_id) VALUES ('1', '3');

