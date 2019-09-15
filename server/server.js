const express = require('express');
const session = require('client-sessions');
const fs = require('fs');
<<<<<<< HEAD
const multer = require ('multer');
const path = require('path');
=======
// const multer = require ('multer');

>>>>>>> 4e6e596221511f5a0632edd8bf79e413ce4d6fa2
// import config file
const init = require('./config.json');

const app = express();

const port = process.env.PORT || 8080;
// assign root index directory
const root = path.join(__dirname,"../public");
const images = path.join(__dirname, "../images");

// map the session info the session middleware
app.use(session(init.sessionSetup));
//
app.use(express.static(root));

app.listen(port, (err) => {
  if (err) throw err;
  console.log('Server started on port', port);
});

app.get('/', (req, res) =>{
  res.send('hello');
});

app.post('/create_user', (req, res) => {

});

