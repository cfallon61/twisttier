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
var userExists = async function (user){
  var email = "";
  var username = "";

  if (user.hasOwnProperty('email')){ email = user.email; }
  if (user.hasOwnProperty('username')){ username = user.username; }

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
async function createUser(accountInfo) {
  var user = { 
    email: accountInfo.email, 
    username: accountInfo.username
  };

  // check if the user exists already
  if (userExists(user))
  {
    return false;
  }

  
};

getSpins ((user, res) =>{
  
  var spin = [
    {
      "user": "poop",
      "date": "post date",
      "text": "content",
      "quotes": quote_count,
      "likes": like_count,
      "tags": [
        {tag1: "name"},
        {tag2: "name"}
      ]
    },
    {
      "user": "poop",
      "date": "post date",
      "text": "content",
      "quotes": quote_count,
      "likes": like_count,
      "tags": [
        {tag1: "name"},
        {tag2: "name"}
      ]
    }
  ]; 
  return spin;
  
});

addSpin ((user, res) =>{
  
});

showNotification((user, res) =>{
  
});

getCurrentTime((user, res) =>{

});

followTopicUserPair ((user, res) =>{
  
});
unfollowTopicUserPair ((user, res) =>{
  
});
likeSpin ((user, res) =>{
  
});
unlikeSpin ((user, res) =>{
  
});
reSpin ((user, res) =>{
  
});

getRespinThread ((user, res) =>{
  
});

// error handler
pool.on('error', (err, client) => {
  console.error('An error occurred: ', err);
});

module.exports = {
  getSpins,
  addSpins,
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