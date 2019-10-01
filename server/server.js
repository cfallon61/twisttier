const express = require('express');
const session = require('client-sessions');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const { check, validationResult } = require('express-validator');

const dotenv = require('dotenv');
const users = require('./accountFunctions.js');
const index = path.join(__dirname, '../build/index.html');


const init = require('./config.json');
const root = path.join(__dirname, "../build");
const images = path.join(__dirname, '../profileImages');

const port = process.env.PORT || 8080;
const app = express();

const pages = ['/', '/login', '/signup', '/timeline', '/settings']

app.use(session(init.sessionSetup));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build/')));

// setup multer with upload desination for images
const storage = multer.diskStorage({

  // handle filename creation
  filename: function (req, file, cb) {
    // create a temporary filename
    var ext = path.extname(file.originalname);
    // strip off extension
    var name = file.originalname.split('.')[0];

    var tempName = name + '_' + Date.now().toString();

    // super hacky way of doing the file name handling
    while (fs.existsSync(path.join(this.dest, tempName))) {
      tempName = name + '_' + Date.now().toString();
    }

    cb(null, tempName);
  },

  destination: function (req, file, cb) {
    cb(null, '../profileImages');
  }
})

// configure other multer params
const upload = multer({
  storage: storage,

  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.filename).toLocaleLowerCase()
    if (ext != '.png' && ext != '.jpg' && ext != '.jpeg') {
      return cb(null, false);
    }
    cb(null, true);
  },

  limits: { fileSize: 1024 * 1024 * 1024 * 5 } // 5 MB

}).single('profileImage');

var server = app.listen(port, (err) => {
  if (err) throw err;
  console.log('Server started on port', port);
});


// TODO ADD SESSION CACHING
// handle user creation
app.post('/create_user',
  [check('email').isEmail(),
  check('password').isLength({ min: 8 }),
  check('bio').isLength({ max: 150 }),
  check('name').isLength({ max: 25, min: 1 }),
  check('username').isLength({ max: 15, min: 1 })],
  notLoggedIn,
  users.postCreateUser, (req, res) => {

    if (res.getHeader('error') != undefined) {
      res.status(406);
    }
    else {
      req.clientSession.uid = req.body.username;
      res.sendFile(index);
    }
  });



// TODO ADD COOKIE / SESSION VALIDATION
// handle profile image uploading
// @param req: the html headers which will include
//              a json with the user information
// @param res: response to client
//             will return 406, Not acceptable to the client
app.post('/uploadProfileImage', upload, (req, res, next) => {
  //placeholder @TODO implement database mapping
  res.status(200).send("good job you uploaded a picture");
});


// TODO send responses to front based on login / logout
app.post('/logout', loggedIn, (req, res) => {
  req.clientSession.uid = null;
  req.clientSession.destroy();
});



app.post('/login', notLoggedIn, users.authorize, (req, res) => {
  // if the authorize function signals an error, send an unauthorized message
  if (res.getHeader('error')) {
    console.log(res);
    res.status(401).send('Unauthorized');
  }
  else {
    req.clientSession.uid = req.body.username;
    res.sendFile(index);
  }
});


app.post('/api/users/:username', notLoggedIn, users.getUserInfo, (req, res) => {
  if (res.getHeader('error') != undefined) {
    res.status(406);
  }
});


// @brief: get a supplied user's timeline
// @respond: json with posts made if user exists, 
//           404 not found error if user not exist
app.post('/api/timeline/:username', notLoggedIn, users.getTimeline, (req, res) => {
  if (res.getHeader('error') === 'user not found'){
    res.status(404)
  }
});

// @brief: get a supplied user's posts
// @respond: json with posts made if user exists, 
//           404 not found error if user not exist
app.post('/api/posts/:username', notLoggedIn, users.getPosts, (req, res) => {
  if (res.getHeader('error') === 'user not found') {
    res.status(404)
  }
});

// wtf this actually fricken fixed it i am PISSED
// TODO limit to non user pages, other pages are assumed to be user pages
app.get('/*', (req, res) => {
  // TODO implement fetching of other user's timeline or error if not exist
  res.sendFile(path.join(root, req.url));
});


function loggedIn(req, res, next) {
  // if logged in continue, else redirect to wherever
  if (req.clientSession.uid) {
    res.setHeader('loggedIn', true);
    console.log('logged in')
    next();
  }
  else {
    res.setHeader('loggedIn', false);
    res.status(406); // TODO route this however 
  }
};

function notLoggedIn(req, res, next) {
  if (!req.clientSession.uid) {
    res.setHeader('loggedIn', false);
    console.log('not logged in')
    return next();
  }
  else {
    res.setHeader('loggedIn', true);
    res.status(406); // TODO set header loggedin false
  }
};

app.use((err, req, res, next) => {
  // TODO implement a log file for errors
  console.log(err.stack);
  res.status(500).send('The server encountered an error');
});
