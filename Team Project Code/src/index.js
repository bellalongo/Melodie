/*
    1. login
    2. registration
    3. music
    4. friends
    5. profile
    6. feed - This is the home page
*/

const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const session = require('express-session');
// const bcrypt = require('bcrypt');
// const axios = require('axios');

// database configuration
const dbConfig = {
    host: 'db',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  };
  
  const db = pgp(dbConfig);
  
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

const user = {
    password: undefined,
    username: undefined,
};

app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.post('/login', async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    const username = req.body.username;
    
    //must connect to spotify api

    var query = 'SELECT * FROM users WHERE users.username = $1;';
    
    db.one(query, username)
    .then( async (data) => {
        const match = await bcrypt.compare(req.body.password, data.password);
        if(Object.keys( data.password ).length > 0)
        {
            if(match)
            {
                console.log("hello sir");

                req.session.user = {
                api_key: process.env.API_KEY,
                };
                req.session.save();
                res.redirect('/feed');
            }
            else{
                console.log("Wrong password");            
            }
        }else{
            console.log("data base request failed");
            console.log(data.password);
            console.log(hash);
            res.redirect('/register');
        }
    })
    .catch(err => {
      console.log(err);
      res.render('pages/login');
      
    });
});

app.get('/register', (req, res) => {
  res.render('pages/register');
});

// Register submission
app.post('/register', async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    const username = req.body.username;

    //must connect to spotify api

    var query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;';
    db.one(query, [username, hash])
    .then(function(data){
      // res.status(201).json({
      //   status: 'success',
      //   data: data,
      //   message: 'data added successfully',
      // });

      user.username = username;
      user.password = hash;
      
      console.log("hello")
      req.session.user = user;
      req.session.save();

      res.redirect('/login');
    })
    .catch(err => {
      console.log(err);
      res.redirect('/register');
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

// Authentication Required
app.use(auth);

app.get('/feed', (req, res) => {
//   axios({
//     url: `https://app.ticketmaster.com/discovery/v2/events.json`,
//         method: 'GET',
//         dataType:'json',
//         params: {
//             "apikey": req.session.user.api_key,
//             "keyword": "Kanye", //you can choose any artist/event here
//             "size": 10,
//         }
//     })
//       .then(results => {
//           console.log(results.data._embedded.events); // the results will be displayed on the terminal if the docker containers are running
//       // Send some parameters
//       console.log("The results are in");
//       // console.log(results.data);
//       res.render('pages/feed', {results: results.data._embedded.events});
//     })
//     .catch(error => {
//       // Handle errors
//       console.log("bruh moment");
//       console.log(error);
//       res.render('pages/feed', {results: []})
//     })
});

// app.get('/discover', (req, res) => {
//   console.log("work");
//   res.render('pages/discover', res);
// });

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.render('pages/logout');
});

app.listen(3000);
console.log('Server is listening on port 3000');