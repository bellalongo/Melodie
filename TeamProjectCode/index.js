const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { use } = require('bcrypt/promises');
const { query } = require('express');

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
  display_name: "hello",
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

// app.get('/', (req, res) =>{
//   res.redirect('/login'); //this will call the /anotherRoute route in the API
// });


// app.get('/home', (req, res) =>{
//   res.redirect('/login'); //this will call the /anotherRoute route in the API
// });

app.get('/register', (req, res) => {
  res.render('pages/register');
});

  // Register submission
app.post('/register', async (req, res) => {
    //the logic goes here
    if(req.body.password.length >= 8 && req.body.password.length <= 60){ //checks that password satifies length requirement
    const hash = await bcrypt.hash(req.body.password, 10);
    const query = 'insert into users (username, password) values ($1,$2);';
    db.none(query, [
        req.body.username,
        hash
      ])
        .then(function(data) {
            res.redirect('/login');
         })
        .catch(function(err) {
          res.render('pages/register', {
            user: [],
            error: true,
            message: `Error Registering Account. Try again.`,
          });
            return console.log(err);
        });
  }
  else{
    //gives error if password too short/long
    res.render('pages/register', {
      user: [],
      error: true,
      message: `Make sure your password is the correct length`,
    });
  }
});

  
app.get('/login', (req, res) => {
  res.render('pages/login');
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

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
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

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          user.display_name = body.display_name;
          console.log(body);
          console.log(user.display_name);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
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
  res.render('pages/profile', {user});
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

app.get('/music', (req, res) => {
  res.render('pages/music', {
    results : 'undefined'
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
      results : resAxios.data.tracks.items
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

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.render('pages/login', {
    message : 'Logged out successfully',
});
});


app.listen(3000);
console.log('Server is listening on port 3000');