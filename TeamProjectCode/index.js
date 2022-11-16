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
//const fileUpload = require('express-fileUpload');

//app.use(fileUpload()); 
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
  name: undefined,
};
  
const images = {
  image_url : undefined
};
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

app.get('/home', (req, res) => {
  res.render('pages/home.ejs', {user});
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

})

app.post('/addfriend', (res,req) => 
{
  const query = 'insert into friends where username = $1;'
  db.any(query, [req.body.username])
    .then(function (data) {
      res.status(201).json({
        status: 'success',
        data: data,
        message: 'friend added successfully',
      });
    })
    .catch(function (err) {
      return console.log(err);
    });
  
})

app.delete('/delete_user/:user_id', (res,req) => 
{
  const user_id = parseInt(req.params.user_id);
  const query = 'delete from reviews where review_id = $1;';
    const query2 = 'delete from trails_to_reviews where review_id = $1;'
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
})

app.get('/friends', (res,req) =>

  axios.get(
    'https://api.spotify.com/v1/me/',
    {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + newAccessToken,
        'Content-Type': 'application/json',
    },
    })
    .then(results => {
      {
        console.log(results.data);
      }
    })
    .catch(error => 
      {
        console.log(error);
      })
)
/*
const knex = require('knex')(
{
  client: 'splite3',
  connection: {
    filename: "./img.db"
  },
  useNullAsDefault: true
});
app.post('/upload', async (req,res) =>)
{
  const (name,data) = req.files.pic;
  if( name && data)
  {
    
  }
  await knex.insert({name: name, omg: data}).into('img');

}
*/
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.render('pages/login', {
    message : 'Logged out successfully',
});
});


app.listen(3000);
console.log('Server is listening on port 3000');
