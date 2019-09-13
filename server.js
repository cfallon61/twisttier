const express = require('express');
const session = require('client-sessions');
require('dotenv').config({path: __dirname + "/.env"});
// import config file
const init = require('./config.json');
const app = express();

const port = process.env['LISTEN_PORT'];

// map the session info the session middleware
app.use(session(init.sessionSetup));

app.listen(port, (err) => {
  if (err) throw err;
  console.log('Server started on port', port);
});

app.get('/', (req, res) =>{
  res.send('hello');
});

