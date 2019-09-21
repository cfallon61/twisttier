// file with the main database interaction functions

const credentials = require('./config.json');
const helper = require('./helpers.js');

// import postgres lib
const { Pool } = require("pg");
// create new postgres client pool 
const pool = new Pool(credentials.database);
const usertable = process.env.USER_TABLE;

// query the database to see if the user exists
// parameter user is object of form {email: [email], username: [username]}
var userExists = async function (user) {
  var email = "";
  var username = "";

  if (user.hasOwnProperty('email')) { email = user.email; }
  if (user.hasOwnProperty('username')) { username = user.username; }

  var params = [usertable, email, username];

  var res = await pool.query("SELECT EMAIL, USERNAME FROM $1 WHERE EMAIL=\'$2\' OR USERNAME=\'$3\'", params);

  console.log(res);

  // return boolean of whether the db returned an empty string
  return helper.isEmpty(res);
}



// database function that does all the heavy lifting
// @param accountInfo: object with all the user details from the create account form
// @return: bool
//         true if creation successful, false if not
createUser = async function (accountInfo) {
  var user = {
    email: accountInfo.email,
    username: accountInfo.username
  };

  // check if the user exists already
  if (userExists(user)) {
    return false;
  }

  store the hashed password in the database
  bcrypt.hash(accountInfo.password, saltRounds, function (err,   hash) {
    // this parts needs to be replaced by 
    
    // db.User.create({
    //   name: req.body.usernamesignup,
    //   email: req.body.emailsignup,
    //   password: hash
    //   }).then(function(data) {
    //    if (data) {
    //    res.redirect('/home');
    //    }
    // });
  
  });
};

getSpins = function (user, res) {
  var spin = [
    {
      "user": "poop",
      "date": "post date",
      "text": "content",
      "quotes": 30,
      "likes": 12,
      "tags": [
        { tag1: "name" },
        { tag2: "name" }
      ]
    },
    {
      "user": "poop",
      "date": "post date",
      "text": "content",
      "quotes": 0,
      "likes": 100,
      "tags": [
        { tag1: "name" },
        { tag2: "name" }
      ]
    }
  ];
  return spin;
};

addSpin = function (user, spin) {
  
};

showNotification = function (user, res) {

};

getCurrentTime = function () {
  var moment = require('moment');
  return moment().format('MMMM Do YYYY, h:mma');
};

followTopicUserPair = function (user, res) {

};

unfollowTopicUserPair = function (user, res) {

};

likeSpin = function (user, res) {

};

unlikeSpin = function (user, res) {

};

reSpin = function (user, res) {

};

getRespinThread = function (user, res) {

};

// error handler
pool.on('error', (err, client) => {
  console.error('An error occurred: ', err);
});

module.exports = {
  getSpins,
  addSpin,
  showNotification,
  getCurrentTime,
  followTopicUserPair,
  unfollowTopicUserPair,
  likeSpin,
  unlikeSpin,
  reSpin,
  getRespinThread,
  createUser
};