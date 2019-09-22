const express = require('express');
const session = require('client-sessions');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const db = require('./dbFunctions');
const { check, validationResult } = require('express-validator');

const dotenv = require('dotenv');
const mids = require('./middleware.js');


const init = require('./config.json');
const root = path.join(__dirname, "../public");
const port = process.env.LISTEN_PORT || 8080;
const app = express();
app.use(session(init.sessionSetup));
app.use(express.json());

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

  destination: function(req, file, cb){
    cb(null, '../profileImages');
  }
})

// configure other multer params
const upload = multer({
  storage: storage,

  fileFilter: function (req, file, cb){
    var ext = path.extname(file.filename).toLocaleLowerCase()
    if (ext != '.png' && ext != '.jpg' && ext != '.jpeg'){
      return cb(null, false);
    }
    cb(null, true);
  },
  
  limits:{ fileSize: 1024 * 1024 * 1024 * 5} // 5 MB

}).single('profileImage');



app.listen(port, (err) => {
  if (err) throw err;
  console.log('Server started on port', port);
});


app.get('/', (req, res) => {
  res.send('hello');
  console.log("requested root");
  // res.sendFile(path.join(root, "index.html"));
});

// TODO ADD SESSION CACHING
// handle user creation
// @param req: the html headers which will include
//              a json with the user information
// @param res: response to client
//             will return 406, Not acceptable to the client if creation fails
//             or redirect to next page
app.post('/create_user',
[check('email').isEmail(), 
 check('password').isLength({min:8}),
 check('bio').isLength({max:150}),
 check('name').isLength({max:25, min: 1}),
 check('username').isLength({max:15, min: 1})], 
 mids.postCreateUser);
 


// TODO ADD COOKIE / SESSION VALIDATION
// handle profile image uploading
// @param req: the html headers which will include
//              a json with the user information
// @param res: response to client
//             will return 406, Not acceptable to the client
app.post('/uploadProfileImage', upload, (req, res, next) =>
{
  //placeholder @TODO implement database mapping
  res.status(200).send("good job you uploaded a picture");
});


app.use((err, req, res, next) =>{
  // TODO implement a log file for errors
  console.log(err.stack);
  res.status(500).send('The server encountered an error');
});
