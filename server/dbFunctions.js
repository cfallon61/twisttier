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

function userTableName(username) { 
  var name = username + "_spins";
  return (TEST ? name + "_test" : name);
};

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
  var rows = [];

  try {

    const hash = await bcrypt.hash(accountInfo.password, 10);
    accountInfo.passhash = hash;

    // dynamically create tables based on if this is development or not
    var tablename = userTableName(accountInfo.username);
    
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

    rows = res.rows;
    
  } 
  catch (e) {
    await client.query('ROLLBACK');
    console.log(`Error caught by error handler: ${e}`);
    // return e;
  } 
  finally {
    client.release();
  }

  return (rows.length === 0 ? false : true);
};


// function that deletes user info
// this function is to be called after the server has properly authenticated
// @param username: the user's username
// @return true on success, error on failure
async function deleteUser(username){
  const client = await pool.connect();
  var rows = [];

  try{
    var tablename = userTableName(username);

    // delete spin table
    var query =  `DROP TABLE ${tablename}`;

    var res = await client.query(query);

    query = `DELETE FROM ${USER_TABLE} WHERE username=$1`;

    var res = await client.query(query, [username]);
    await client.query('COMMIT');

    rows = res.rows;
  } 
  catch (e) {
    await client.query('ROLLBACK');
    console.log(`Error caught by error handler: ${ e }`);
    // return e;
  } 
  finally {
    client.release();
  }
  return (rows.length === 0 ? true : false);
};

async function getSpins(user, res) {

};

async function addSpin(user, spin) {
  
};

async function showNotification(user, res) {

};

async function followTopicUserPair(pair) {

};

async function unfollowTopicUserPair(pair) {

};

// funtion increments like number of the spin by 1
// check that user_liker hasn't already liked the spin
// check that user_liker is added to spin's like_list
// @param user_liker: username of user which is liking the spin
// @param user_poster: username of user which is recieveing the like on his spin
// @param spin: spin which is being liked
// @return true on success and false on failure
async function likeSpin(user_liker, user_poster, spin) {
  const client = await pool.connect();

  try {
    var tablename = userTableName(user_poster+'_spins_test');
    var query =  `DROP TABLE ${tablename}`;

  } catch(e) {
    await client.query('ROLLBACK');
    console.log(`Error caught by error handler: ${ e }`);
  }
};

async function unlikeSpin(user, res) {

};

async function reSpin(user, res) {

};

async function getRespinThread(user, res) {

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
  userExists,
  deleteUser
};