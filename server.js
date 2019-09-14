const express = require('express');
const session = require('client-sessions');
// import config file
const init = require('./config.json');
const app = express();

const port = process.env.PORT || 8080;
const root = path.join(__dirname,"./pages");

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

