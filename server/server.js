const express = require('express');
const session = require('client-sessions');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
// import config file
const init = require('./config.json');

const app = express();

const port = process.env.LISTEN_PORT || 8080;
// assign root index directory
const root = path.join(__dirname, "../public");
const images = path.join(__dirname, "../images");

// map the session info the session middleware
app.use(session(init.sessionSetup));
//
app.use(express.static(root));

app.listen(port, (err) => {
  if (err) throw err;
  console.log('Server started on port', port);
});

app.get('/', (req, res) => {
  res.send('hello');
  console.log("requested root");
  // res.sendFile(path.join(root, "index.html"));
});

app.post('/create_user', (req, res) => {

});

