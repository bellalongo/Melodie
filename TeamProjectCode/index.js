const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { use } = require('bcrypt/promises');
const { query } = require('express');
const { minify } = require('pg-promise');

// database configuration
const dbConfig = {
    host: 'db',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
};
 
const db = pgp(dbConfig);


const user = {
  username:undefined,
  password:undefined,
  display_name: undefined,
  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
};
 
 
const images = {
  image_url : undefined
};
 
const tokens = {
  access:undefined,
  refresh:undefined
}
 


// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });
 
app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
    })
  );
 
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static(__dirname + '/public'));
 

var page;

const add_user = 
`INSERT INTO users(username) VALUES ($1)
 ON CONFLICT (username) DO NOTHING;`;
const find_user = `SELECT username FROM users WHERE users.username = $1`;

app.use(express.static(__dirname + '/public'));
// app.get('/', (req, res) =>{
//   res.redirect('/login'); //this will call the /anotherRoute route in the API
// });
 
 
app.get('/register', (req, res) => {
  res.render('pages/register');
});


const g_snippets = {
  snippets : undefined
};

app.get('/profile', (req, res) => {
  
  const access_token = tokens.access;
  const token = "Bearer " + access_token;
  var newSongsURL = 'https://api.spotify.com/v1/me/top/tracks?limit=5';
  // const song = req.body.songName;

  const query = "SELECT * FROM snippets;";

  axios.all([
    axios.get(newSongsURL, {
      headers: {
        'Authorization': token,
      }
    }),
    db.query(query)
  ])
  .then(axios.spread((topsongs, allsnippets) => {
    console.log("snippets pleae work:", allsnippets);
    console.log(topsongs.data.items[0].album.images[0]);
    g_snippets.snippets = allsnippets;
    res.render('pages/profile', {
      results : topsongs.data.items,
      user,
      tokens : access_token,
      snippets : allsnippets
    });
  }))
  .catch((error) => {
    console.error(error)
  })
});


 
  // Register submission
app.post('/register', async (req, res) => {
  //   //the logic goes here
  //   if(req.body.password.length >= 8 && req.body.password.length <= 60){ //checks that password satifies length requirement
  //   const hash = await bcrypt.hash(req.body.password, 10);
  //   const query = 'insert into users (username, password) values ($1,$2);';
  //   db.none(query, [
  //       req.body.username,
  //       hash
  //     ])
  //       .then(function(data) {
  //           res.redirect('/login');
  //        })
  //       .catch(function(err) {
  //         res.render('pages/register', {
  //           user: [],
  //           error: true,
  //           message: `Error Registering Account. Try again.`,
  //         });
  //           return console.log(err);
  //       });
  // }
  // else{
  //   //gives error if password too short/long
  //   res.render('pages/register', {
  //     user: [],
  //     error: true,
  //     message: `Make sure your password is the correct length`,
  //   });
  // }
});
 
 
app.get('/login', (req, res) => {
  res.render('pages/login.ejs');
});
 
app.post('/login', async (req, res) => {
  const query = "select * from users where username = $1";
  db.one(query, [
    req.body.username
  ])
    .then(async(user) => {
      const match = await bcrypt.compare(req.body.password, user.password);
      if(match)
      {
          req.session.user = {
            api_key: process.env.API_KEY,
          };
          req.session.save();
          res.redirect('/home');
       
      }
      else
      {
          console.log("Incorrect username or password");
          res.render('pages/login', {
            user: [],
            error: true,
            message: `Incorrect Password`,
          });
      }
    })
    .catch(function(err) {
      console.log(err);
      res.render('pages/login', {
        user: [],
        error: true,
        message: `Incorrect Username`,
      });
    });
});
 
 
 
// var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
 
var client_id = '82b7d3fec1294fda85370024ea2e0c8b'; // Your client id
var client_secret = '79d59ba1373f4536bb01a2c8a34a9931'; // Your secret
var redirect_uri = 'http://localhost:3000/callback'; // Your redirect uri
 
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
 
var stateKey = 'spotify_auth_state';
 
// var app = express();
 
app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());
 
app.get('/login_spotify', function(req, res) {
 
  // page = req.body.page;
  // console.log(req.body.page);
  var state = generateRandomString(16);
  res.cookie(stateKey, state);
 
  // your application requests authorization

  var scope = 'streaming user-read-private user-read-email user-library-read user-top-read';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});
 
app.get('/callback', function(req, res) {
 
  // your application requests refresh and access tokens
  // after checking the state parameter
 
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;
 
  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code"
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };
 
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
 
        var access_token = body.access_token,
            refresh_token = body.refresh_token;

          tokens.access = access_token;
          tokens.refresh = refresh_token;
 
       
          tokens.access = access_token;
          tokens.refresh = refresh_token;
 
        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };
 
        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
          user.display_name = body.display_name;
          user.username = body.id;
          if(body.images[0]){
            user.picture=body.images[0].url;
          }

          db.any(add_user, [body.display_name, body.id])
          .then(
            console.log('WOOOOOOO')
          )
          
          // console.log(user.display_name);
          // console.log(user.picture);
          //console.log(body.images[0].url);
        });
 
        // we can also pass the token to the browser to make requests from there
        res.redirect('/home');
          console.log(querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }))
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/', (req, res) => {
//  res.render('pages/profile', {user, tokens : access_token, snippets : g_snippets.snippets});
  res.render('pages/login');
});
 
app.get('/refresh_token', function(req, res) {
 
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };
 
  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      tokens.access = access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});
 
 
 
// Authentication Middleware.
// const auth = (req, res, next) => {
//     if (!req.session.user) {
//       // Default to register page.
//       return res.redirect('/register');
//     }
//     next();
//   };
 
// app.use(auth);
 
/*
-
-
-
JS Code for the Feed, Profile, Friends, and Rankings goes here
-
-
-
 
*/
app.get('/editprofile', (req,res) =>
{
  res.render('pages/editprofile');
})
app.post('/editprofile', (req,res) =>
{
    if(req.body.image_id !== null && req.body.user_id !== null)
    {
      query  = 'update users set name = $1 where user_id = $2;';
      query2 = 'update images set image_url = $1, where image_id = $2;';
      db.any(query, [req.body.name, req.body.user_id])
      db.any(query2, [req.body.image_url, req.body.image_id])
      .then(function (data) {
        res.status(201).json({
          status: 'success',
          data: data,
          message: 'name and image added successfully',
        });
      })
      .catch(function (err) {
        return console.log(err);
      });
    }
    else if(req.body.image_id !== null)
    {
      query2 = 'update images set image_url = $1 where image_id = $2;';
      db.any(query2, [req.body.image_url, req.body.image_id])
      .then(function (data) {
        res.status(201).json({
          status: 'success',
          data: data,
          message: 'image added successfully',
        });
      })
      .catch(function (err) {
        return console.log(err);
      });
    }
    else
    {
      query = 'update users set name = $1 where user_id = $2;';
      db.any(query, [req.body.review ,req.body.review_id])
      .then(function (data) {
        res.status(201).json({
          status: 'success',
          data: data,
          message: 'review added successfully',
        });
      })
      .catch(function (err) {
        return console.log(err);
      });
    }
    
});


 


app.get('/search', (req,res) =>
{
 
  const sql = 'select * from users where username = $1;'
  db.any(sql,[req.query.search])
  .then(users=> {
  
    res.render('pages/friends', 
    {
      users
    })
  })
  .catch(function (err) {
    return console.log(err);
  });
});
app.post('/addfriend', (req, res) => {
  const sql = 'insert into friends (username,name,display_image) VALUES ($1,$2,$3);'
  db.any(sql, 
    [
      req.body.u,
      req.body.n,
      req.body.i
    ])
    .then(function (data) {
      console.log(data);
      res.redirect('/home');
    })
    .catch(function (err) {
      return console.log(err);
    });
});
 
app.delete('/delete_user/:user_id', async (req, res) => {
  const user_id = parseInt(req.params.user_id);
  const query = 'delete from users where user_id = $1;';
    const query2 = 'delete from users_to_snippets where users_id = $1;'
    console.log(query);
    db.any(query, [user_id])
      .then(function (data) {
        db.any(query2,[user_id])
        res.status(200).json({
          status: success,
          data: data,
          message: 'data deleted successfully',
        });
      })
      .catch(function (err) {
        return console.log(err);
      });
});
 
app.get('/home', (req, res) => {
  const access_token = tokens.access;
  const token = "Bearer " + access_token;
  var playlistURL = 'https://api.spotify.com/v1/playlists/37i9dQZEVXbLRQDuF5jeBp/tracks?limit=5';
  var newSongsURL = 'https://api.spotify.com/v1/playlists/37i9dQZF1DX4JAvHpjipBk/tracks?limit=5';
  const options = {
    url: 'https://billboard-api2.p.rapidapi.com/hot-100?range=1-10&date=2022-05-11',
    params: {range: '1-10', date: '2019-05-11'},
    headers: {
      'X-RapidAPI-Key': 'da3763635cmshbf8f63637b17f51p1c5d73jsn3527c834617e',
      'X-RapidAPI-Host': 'billboard-api2.p.rapidapi.com'
    }
  };
  const query = "SELECT * FROM posts WHERE username IN (SELECT username FROM friends JOIN users_to_friends ON users_to_friends.friend_id = friends.friend_id WHERE users_to_friends.user_id = 1);";
  const query3 = 'select * from friends ORDER BY RANDOM() LIMIT 6';
  const query2 = 'select * from users WHERE user_id BETWEEN 7 AND 16 ORDER BY RANDOM() LIMIT 5';
  axios.all([
    axios.get(playlistURL, {
      headers: {
        'Authorization': token,
      }
    }),
    axios.get(newSongsURL, {
      headers: {
        'Authorization': token,
      }
    }),
      db.query(query),
      db.query(query2),
      db.query(query3),
      axios.request(options)
    ]).then(axios.spread((topsongs, newsongs, allposts,cycleusers,cyclefriends,billboardData) => {
      console.log(allposts);
      console.log(cycleusers);
      res.render('pages/home', {
        results : topsongs.data.items,
        newsongs: newsongs.data.items,
        posts : allposts,
        users: cycleusers,
        friends: cyclefriends,
        billboard : billboardData.data.content
      });
  })
  )
  .catch((error) => {
    console.error(error)
  })
});



app.get('/friends', (req,res) =>
{
  const query = 'select * from friends';
  const query2 = 'select * from users WHERE user_id BETWEEN 1 AND 16 order by random()';
  db.any(query)
    .then(friends =>{
      db.any(query2)
        .then(users=>
          {
            res.render('pages/friends',
            {
              friends,
              users
            })
          })
    })
    .catch(error => 
      {
        console.log(error)
        res.render('pages/friends',{
        friends : [],
        users : [],
        error: true
      });
    });
});


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.render('pages/login', {
    message : 'Logged out successfully',
  });
});

app.get('/music', (req, res) => {
  res.render('pages/music', {
    results : 'undefined',
    tokens : 'undefined'
  });
})

app.post('/music', (req, res) => {
  const song = req.body.songName;
  //console.log(song);
  const access_token = tokens.access;
  const token = "Bearer " + access_token;
  var searchUrl = "https://api.spotify.com/v1/search?q=" + song + "&type=track&limit=4";

  axios.get(searchUrl, {
    headers: {
      'Authorization': token,
    }
  })
  .then((resAxios) => {
      //console.log(resAxios.data)
      //spotifyResult = resAxios.data;


      //console.log(resAxios.data.tracks.items);
      
      res.render('pages/music', {
        results : resAxios.data.tracks.items,
        tokens : access_token
      });

      // //Extracting required data from 'result'. The following "items[0].id.videoId" is the address of the data that we need from the JSON 'ytResult'.
      // let spotifyTrackIdAppJs00 = spotifyResult.tracks.items[0].id;
      // let spotifyAlbumIdAppJs00 = spotifyResult.tracks.items[0].album.id;
      // let spotifyArtistIdAppJs00 = spotifyResult.tracks.items[0].artists[0].id;
      // console.log("Fetched values: " + spotifyTrackIdAppJs00 + ", " + spotifyAlbumIdAppJs00 + ", " + spotifyArtistIdAppJs00);

      // // The 'results' named EJS file is rendered and fed in response. The 'required' data is passed into it using the following letiable(s).
      // // A folder named 'views' has to be in the same directory as "app.js". That folder contains 'results.ejs'.
      // res.render("results", {
      //   spotifyTrackIdEjs00: spotifyTrackIdAppJs00,
      //   spotifyAlbumIdEjs00: spotifyAlbumIdAppJs00,
      //   spotifyArtistIdEjs00: spotifyArtistIdAppJs00
      // });
      // console.log("Values to be used in rendered file: " + spotifyTrackIdAppJs00 + ", " + spotifyAlbumIdAppJs00 + ", " + spotifyArtistIdAppJs00);
    })
    .catch((error) => {
      console.error(error)
    })
  });


  app.post('/addsnippet', (req, res) => {

    var song_minutes = 0;
    var song_seconds = 0;

    if(req.body.minutes){
      song_minutes = req.body.minutes;
    }
    if(req.body.seconds){
      song_seconds = req.body.seconds;
    }

    var song_totalTime = song_minutes * 60000 + song_seconds * 1000;
    var song_name = req.body.chosenSong;
    var song_artist = req.body.chosenArtist;
    var song_image = req.body.chosenImage;
    var song_id = req.body.song;
    console.log("song test",song_id);
    var user_comment = req.body.userComment;
    var user_username = user.display_name;

    const snippetsquery = `INSERT INTO snippets(track_id, song_name, start_time) VALUES ($1, $2, $3) RETURNING *;` ;
    const users_to_snip_query = `INSERT INTO users_to_snippets(user_id) SELECT user_id FROM users WHERE users.username = $1 RETURNING *;`;
    const postquery = `INSERT INTO posts(username, user_action, user_comment, song_name, song_artist, song_image) VALUES ($1,'updated a snippet!',$2,$3,$4,$5) RETURNING *;`;
    const users_to_posts_query = `INSERT INTO users_to_posts(user_id) SELECT user_id FROM users WHERE users.username = $1 RETURNING *;`;

    axios.all([
      db.one(snippetsquery, [song_id, song_name, song_totalTime, user_username]),
      db.one(postquery, [user_username, user_comment, song_name, song_artist, song_image]),
      db.one(users_to_snip_query, [user_username]),
      db.one(users_to_posts_query, [user_username])
    ])
    .then(((snippets, posts, usersnip, userposts) => {
      console.log("snippets", snippets);
      console.log(posts);
      console.log(usersnip);
      console.log(userposts);
      res.redirect('/music');
    })
    )
    .catch((error) => {
      console.error(error)
    });
  });

  // THIS DOES NOTHING
  // app.put('/music', (req, res) => {
  //   console.log(req.body.device)
  //   const access_token = tokens.access;
  //   const token = "Bearer " + access_token;
  //   const device_id = req.body.device;
  //   var searchUrl = "https://api.spotify.com/v1/me/player/play?device_id=" + device_id;

  //   //"{\"context_uri\":\"spotify:album:5ht7ItJgpBH7W6vJ5BqpPr\",\"offset\":{\"position\":5},\"position_ms\":0}" -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer BQAcfgh96EGQF_HZ0o6hVhn_CoKP81zV_O17Y6EKKUCU1tYLZfkb9MS5hW7RJLePLX994muribDjcGBtenncuc59PTouhll09zXcRt8ckmOkmsXcZAehftF46W6QJ9Ppw8IQKELLHA5vhhO5fZhh8iZqdBaAw6vJOm-CEErpEaatRlvJMKP5rIKR5hc-SL23UOBBxC4"

  //   axios.put(searchUrl, {
  //     context_uri: req.body.song,
  //     //position_ms: req.body.position,
  //     headers:{
  //       'Authorization': token,
  //     }
  //   })
  // });

// const express = require('express')
// const request = require('request');
const dotenv = require('dotenv');
const { access } = require('fs');


const port = 5000

global.access_token = ''

dotenv.config()

var spotify_client_id = process.env.API_KEY;
var spotify_client_secret = process.env.SESSION_SECRET;

var spotify_redirect_uri = 'http://localhost:3000/auth/callback'

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

 
// var app = express();
 
app.get('/auth/login', (req, res) => {
 
  var scope = "streaming user-read-email user-read-private user-library-read"
  var state = generateRandomString(16);
 

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri,
    state: state
  })


  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
})

app.get('/auth/callback', (req, res) => {

  var code = req.query.code;

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: spotify_redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      res.redirect('/')
    }
  });


})

app.get('/auth/token', (req, res) => {
  res.json({ access_token: access_token})
})

app.listen(3000);
console.log('Server is listening on port 3000');
 
 
 


