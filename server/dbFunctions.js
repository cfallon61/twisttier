// file with the main database interaction functions

const credentials = require('./config.json');
const helper = require('./helpers.js');
const dotenv = require('dotenv').config();
const bcrypt = require('bcrypt');
// import postgres lib
const { Pool } = require("pg");
// create new postgres client pool 
const pool = new Pool(credentials.database);

const USER_TABLE = process.env.USER_TABLE;
const SPIN_TEMPLATE = process.env.SPIN_TEMPLATE;
const TEST = (process.env.TEST === "true" ? true : false);


// query the database to see if the user exists
// parameter user is object of form {email: [email], username: [username]}
var userExists = async function (user) {
  
  var params = [user.email, user.username];
  
  var query = `SELECT * FROM ${USER_TABLE} WHERE EMAIL=$1 OR USERNAME=$2`;
  var res = await pool.query(query, params);
  // response is a json 
  // need to get rows, which is a list

  var rows = res.rows;
  // console.log(rows);
  if (rows.length > 0) {
    // should have only 1 index of the username / email occurring
    // so this is why the [0];
    return rows;
  }
  // return false if they dont already exist, this is good
  return false;
}

function addToUsers(accountInfo){
  
}

// database function that does all the heavy lifting
// @param accountInfo: object with all the user details from the create account form
// @return: object containing creation info
//         true if creation successful, false if not
 async function createUser(accountInfo) {
  
  // check if the user exists already
  var existing = await userExists(accountInfo);
  if (existing != false){
    return existing;
  }

  const client = await pool.connect();

  try {
    var tablename = accountInfo.username + "_spins";

    const hash = await bcrypt.hash(accountInfo.password, 10);
    accountInfo.passhash = hash;

    // dynamically create tables based on if this is development or not
    tablename = (TEST ? tablename + "_test" : tablename);
    var args = [tablename, SPIN_TEMPLATE];
    await client.query('BEGIN');

    // create the user table
    var query = `CREATE TABLE IF NOT EXISTS ${tablename} () INHERITS (${SPIN_TEMPLATE})`;

    var res = await client.query(query);
    // console.log(res);

    args = [
      accountInfo.email,
      accountInfo.username,
      accountInfo.passhash,
      'NOW()',
      'NOW()',
      accountInfo.bio,
      accountInfo.name,
      [], // followers
      {}, // following
      [], // interests
      {}, // accessibility features
    ];

    query = `INSERT INTO ${USER_TABLE} (email, 
      username, passhash, create_date, last_login, bio, 
      name, followers, following, interests, accessibility_features) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8::VARCHAR(15)[], $9::JSON, $10::VARCHAR(20)[], $11::JSON)`;

    res = await client.query(query, args);
    // tell server we are done 
    await client.query('COMMIT');
    
  } catch (e){
    await client.query('ROLLBACK');
    console.log(e);
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
  followTopicUserPair,
  unfollowTopicUserPair,
  likeSpin,
  unlikeSpin,
  reSpin,
  getRespinThread,
  createUser,
  userExists
};