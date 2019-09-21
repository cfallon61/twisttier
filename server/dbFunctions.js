// file with the main database interaction functions

const credentials = require('./config.json');
const helper = require('./helpers.js');
//const dotenv = require('dotenv').config();

// import postgres lib
const { Pool } = require("pg");
// create new postgres client pool 
const pool = new Pool(credentials.database);

const USER_TABLE = process.env.USER_TABLE;
const SPIN_TEMPLATE = process.env.SPIN_TEMPLATE;
const TEST = (process.env.TEST === "true" ? true : false);

passHash = function (password) {
  var passwordHash = require('./lib/password-hash');
  var passHashed = passwordHash.generate(password);
  return passHashed;
};


// query the database to see if the user exists
// parameter user is object of form {email: [email], username: [username]}
var userExists = async function (user) {
  
  var params = [user.email, user.username];
  
  var query = `SELECT EMAIL, USERNAME FROM ${USER_TABLE} WHERE EMAIL=$1 OR USERNAME=$2`;
  var res = await pool.query(query, params);
  // response is a json 
  // need to get rows, which is a list

  var rows = res.rows;

  if (rows.length > 0) {
    var error = [];
    // should have only 1 index of the username / email occurring
    // so this is why the [0];
    var vals = rows[0];

    if ('email' in vals) {
      error.push("Email already in use");
    }
    if ('username' in vals) {
      error.push('Username already in use');
    }
    return error;
  }
  // return false if they dont already exist, this is good
  return false;
}


// database function that does all the heavy lifting
// @param accountInfo: object with all the user details from the create account form
// @return: object containing creation info
//         true if creation successful, false if not
 async function createUser(accountInfo) {
  
  // check if the user exists already
  var existing = await userExists(accountInfo);
  console.log(existing);
  if (existing != false){
    return existing;
  }

  const client = await pool.connect();

  try {
    var tablename = accountInfo.username + "_spins";
   
    tablename = (TEST ? tablename + "_test" : tablename); // doubtful this will work lol
    var args = [tablename, SPIN_TEMPLATE];
    await client.query('BEGIN');

    // create the user table
    var query = `CREATE TABLE ${args.tablename}() INHERITS (${SPIN_TEMPLATE})`;

    var res = await client.query(query);
    await client.query("ROLLBACK");
    return true;

    args = [
      USER_TABLE, 
      accountInfo.email, 
      accountInfo.username,
      accountInfo.passhash,
      'CURRENT_TIMESTAMP',
      'CURRENT_TIMESTAMP',
      accountInfo.bio,
      accountInfo.name
    ];
    // dynamic way of creating the field string, but i guess i can type the string in the query itself
    // i just didn't want to
    var fields = "(";
    var i = 2;
    for (var x in args){
      fields += "$" + toString(i) + ", ";
    }
    fields += ")";

    query = 'INSERT INTO $1 (email, username, passhash, create_date, last_login, bio, name) VALUES ' + fields;
    

    

  } catch (e){
    await client.query('ROLLBACK');
    return e;
  } finally {
    client.release();
  }

  return true;  
};

getSpins = function (user, res) {

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
  createUser,
  userExists
};