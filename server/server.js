const express = require('express');
const session = require('client-sessions');
const cookieParser = require('cookie-parser');
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

app.use(session(init.sessionSetup));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build/')));

// setup multer with upload desination for images
const storage = multer.diskStorage({

  // handle filename creation
  filename: function(req, file, cb) {
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

  destination: function(req, file, cb) {
    cb(null, '../profileImages');
  }
});

// configure other multer params
const upload = multer({
  storage: storage,

  fileFilter: function(req, file, cb) {
    var ext = path.extname(file.filename).toLocaleLowerCase()
    if (ext != '.png' && ext != '.jpg' && ext != '.jpeg') {
      return cb(null, false);
    }
    cb(null, true);
  },

  limits: {
    fileSize: 1024 * 1024 * 1024 * 5
  } // 5 MB

}).single('profileImage');

var server = app.listen(port, (err) => {
  if (err) throw err;
  console.log('Server started on port', port);
});


// TODO ADD SESSION CACHING
// handle user creation
app.post('/create_user',
  [check('email').isEmail().withMessage('invalid email'),
   check('password').isLength({ min: 8}).withMessage('password too short'),
   check('bio').isLength({ max: 150 }).withMessage('bio too long'),
   check('name').isLength({ max: 25, min: 1 }).withMessage('invalid name'),
   check('username').isLength({ max: 15, min: 1 }).withMessage('invalid username')
  ],
  notLoggedIn, upload, users.postCreateUser, (req, res) => {
    // console.log(validationResult(req));
    
    if (res.getHeader('error') != undefined) {
      res.status(406).send();
    } else {
      createSession(req, res);
      res.sendFile(index);
    }
    // TODO look into redirecting to / instead of index

  });


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
app.get('/logout', loggedIn, (req, res) => {
  console.log(req.clientSession.uid, 'is logging out');
  // console.log(req.cookies);
  deleteSession(req, res);
  res.redirect('/'); // redirect to home page
});

// @brief: route handler for checking if a user is logged in
//         will redirect to / if already logged in, otherwise
//         will continue to login page
app.get('/login', notLoggedIn, (req, res) => {
  console.log('GET /login');
  res.sendFile(index);
});

// @brief: endpoint to actually handle the login request for a user
app.post('/login', notLoggedIn, users.authorize, (req, res) => {
  // if the authorize function signals an error, send an unauthorized message
  console.log(req.body.username || req.body.email, 'logging in');
  if (res.getHeader('error')) {
    // console.log(res);
    res.status(401).sendFile(index);
  } else {
    createSession(req, res);
    res.sendFile(index);
  }
});

// @brief: endpoint for querying the logged in status of a user
// @response: header loggedIn: true and cookie loggedIn=true if user is logged in, otherwise
//            these valuse will be false
app.post('/api/login_status', (req, res) => {
  if (req.clientSession.uid && req.cookies.loggedIn){
    createSession(req, res);
  }
  else {
    deleteSession(req, res);
  }
});


// @brief: enpoint to get a supplied user's profile information
app.post('/api/users/:username', users.getUserInfo, (req, res) => {
  if (res.getHeader('error') != undefined) {
    res.status(406);
  }
});


// @brief: get a supplied user's timeline
// @respond: json with posts made if user exists,
//           404 not found error if user not exist
app.post('/api/timeline/:username', users.getTimeline, (req, res) => {
  if (res.getHeader('error') != undefined) {
    res.status(404)
  }
});

// @brief: get a supplied user's posts
// @respond: json with posts made if user exists,
//           404 not found error if user not exist
app.post('/api/posts/:username', users.getPosts, (req, res) => {
  console.log(res);
  if (res.getHeader('error') != undefined) {
    res.status(404)
  }
});



// @brief: update a user's profile information

// @respond: IDK man i'm tired

app.post('/api/update/:username', loggedIn,
        [check('bio').isLength({ max: 150 }).withMessage('bio too long'),
         check('name').isLength({ min: 1, max: 25 }).withMessage('invalid name'), 
        ], users.updateProfileInfo, (req, res) => {
    
  if (res.getHeader('error') != undefined) {
      res.status(406)
  }
  res.sendFile(index);
});


// @brief: endpoint for creating a spin. user must be logged in or this will not work.
app.post('/api/add_spin', loggedIn,
        [check('spinBody').isLength({ min: 1, max: 90 }).withMessage('invalid spin length') 
        ], users.createSpin, (req, res) => {
    // TODO add error states for invalid input
  if (res.getHeader('error') != undefined) {
    res.status(418)
  }
  res.sendFile(index);
});

app.post('/api/deleteSpin/:spinId', loggedIn, users.removeSpin, (req, res) => {

  if (res.getHeader('error') != undefined) {
    res.status(418)
  }
  res.sendFile(index);
});


// @brief:  endpoint for deleting account
// @author: Chris Fallon
app.post('/api/delete', loggedIn, users.deleteAccount, (req, res) => {

  if (res.getHeader('error') != undefined) {
    res.status(406);
    res.sendFile(index);
  } else {
    deleteSession(req, res);
    res.redirect('/'); // redirect to home page
  }
});

// wtf this actually fricken fixed it i am PISSED
// TODO limit to non user pages, other pages are assumed to be user pages
app.get('/*', (req, res) => {

  console.log('GET', req.originalUrl);
  res.sendFile(index);
});

// @brief: Create a user session and set relevant headers
function createSession(req, res){
  req.clientSession.uid = res.getHeader('username');
  // console.log('client session =',req.clientSession);
  res.setHeader("loggedIn", true);
  res.cookie('username', req.clientSession.uid, {
    maxAge: 60 * 60 * 24
  });
}

// @brief: delete a client session
// @author: Chris Fallon
function deleteSession(req, res) {

  if (req.clientSession.uid) {
    req.clientSession.uid = null;
    req.clientSession.destroy((err) => { if (err) throw err; });
    res.clearCookie('clientSession');
  }
  if (req.cookies.username)
  {
    req.cookies.username = null;
    res.clearCookie('username')
  }
  console.log(req.clientSession, req.cookies);
  return 0;
}

function loggedIn(req, res, next) {
  // if logged in continue, else redirect to wherever
  if (req.clientSession.uid && req.cookies.loggedIn) {
    res.setHeader("loggedIn", true);
    console.log(req.clientSession.uid, 'is logged in');
    return next();
  } else {
    res.redirect('/'); // TODO route this however
  }
};

function notLoggedIn(req, res, next) {
  // console.log(req.clientSession);
  if (!req.clientSession.uid || !req.cookies.loggedIn) {
    console.log('user is not logged in')
    return next();
  } else {
    res.redirect('/');
  }
};

app.use((err, req, res, next) => {
  // TODO implement a log file for errorsthro
  console.log('The server encountered an error', err.stack)
  res.status(500).send('The server encountered an error');
  throw err;

});
