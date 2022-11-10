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

app.get('/', (req, res) =>{
  res.redirect('/login'); //this will call the /anotherRoute route in the API
});

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
          res.redirect('/profile');
        
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

// Authentication Middleware.
const auth = (req, res, next) => {
    if (!req.session.user) {
      // Default to register page.
      return res.redirect('/register');
    }
    next();
  };


app.use(auth);

app.get('/home', (req, res) => {
  res.render('pages/home');
});
app.get('/profile', (req, res) => {
  res.render('pages/profile',{
    user
  });
});
/*
-
-
-
JS Code for the Feed, Profile, Friends, and Rankings goes here
-
-
-

*/

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.render('pages/login', {
    message : 'Logged out successfully',
});
});


app.listen(3000);
console.log('Server is listening on port 3000');