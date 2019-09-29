// file with the main database interaction functions

const credentials = require('./config.json');
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
    return rows[0];
  }
  // return false if they dont already exist, this is good
  return false;
}

// forms the name of the table of individual users
function userSpinTableName(username) { 
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
    return existing; // return the rows
  }

  // creates postgres client
  const client = await pool.connect();
  var rows = [];

  try {

    const hash = await bcrypt.hash(accountInfo.password, 10);
    accountInfo.passhash = hash;

    // dynamically create tables based on if this is development or not
    var tablename = userSpinTableName(accountInfo.username);
    
    var args = [tablename, SPIN_TEMPLATE];
    
    // begins transaction
    await client.query('BEGIN');

    // create the user table
    var query = `CREATE TABLE IF NOT EXISTS ${tablename} () INHERITS (${SPIN_TEMPLATE})`;

    var res = await client.query(query);

    args = [
      accountInfo.email,
      accountInfo.username,
      accountInfo.passhash,
      'NOW()',
      'NOW()',
      accountInfo.bio,
      accountInfo.name,
      [], // followers
      {
        users: JSON.stringify([
          { username: accountInfo.username, tags: [] }
        ]),
       }, // following
      [], // interests
      {}, // accessibility features
    ];

    query = `INSERT INTO ${USER_TABLE} (email, 
      username, passhash, create_date, last_login, bio, 
      name, followers, following, interests, accessibility_features) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8::VARCHAR(15)[], $9::JSON, $10::VARCHAR(20)[], $11::JSON)`;

    res = await client.query(query, args);
    // tell server we are done (end of transaction)
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
  if (rows.length === 0 && TEST){
    return 'user exists';
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
    var tablename = userSpinTableName(username);

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



// Function to update the last login time
// return true on success, false on error
async function updateLoginTime(username){
  var client = await pool.connect();
  var rows;
  try{
    await client.query('BEGIN');
    const tablename = userSpinTableName(username);
    const query = `UPDATE ${USER_TABLE} SET last_login = NOW() WHERE USERNAME = $1`;
    var res = await client.query(query, [username]);
    rows = res.rows;
    await client.query('COMMIT');
  }
  catch (e) {
    await client.query('ROLLBACK');
    console.log(e);
  }
  finally {
    client.release();
  }

  return (rows.length === 0 ? false : true);
};

// @brief get the spins made by a user
// @return list of spins which match the tags supplied
//          if tags are empty then it returns all user spins
async function getSpins(users) {
  // add each user to a list of users
  const baseQuery = `SELECT * FROM `;
  var query = '';
  var tagList = []
  var followed = JSON.parse(users.users);
  
  // ful SQL injection vulnerability mode: Engaged
  // for each user in the user list, append their spin table to a query string
  // and also search for tags associated with the supplied followed users list 
  // in the followed user's posts
  followed.forEach((item, index) => {
    // select * from <username_spins>  
    query += baseQuery + userSpinTableName(item.username);

    if (item.tags.length > 0) {
      tagList.push(item.tags);
      // supposed to search in the range of a list supplied
      // hopefully postgres decides to parse this correctly
      // select * from <username_spins> where @> tags
      var where = ' WHERE @> $' + String(tagList.length);
  
      // for each tag in the tag list, append it to a where statement
      // item.tags.forEach((tag, i) => {
      //   where += tag + ' IN tags';
      //   // if i is not the last index, append an or
      //   if (i < item.tags.length - 1){
      //     where += ' OR ';
      //   }
      // });
      // append the conditions to the select query
      query += where;
    }

    // if last item in list do not append union
    if (index < followed.length - 1)
    {
      query += ' UNION ALL';
    }

  });
  // final string:
  // SELECT * FROM <user1_spins> WHERE tags @> <tags>
  // UNION ALL
  // SELECT * FROM <user2_spins> WHERE tags @> <tags>
  // UNION ALL
  // ...
  // ORDER BY date;
  query += ' ORDER BY date';
  
  console.log(query);
  var res = await pool.query(query, tagList);
  return res.rows;
};

// Adds the users spin into their spin table
// @param user = user who created the spin
// @param spin = spin to be added into the user's spin table
// @return true if success and false if failure
async function addSpin(user, spin) {
  const client = await pool.connect();
  var rows = [];
    
  try {
    var tablename = userSpinTableName(user.username);
    await client.query('BEGIN');

    var args = [
      spin.content,
      spin.tags,
      false,
      0,
      0,
      spin.is_quote,
      {},
      []
    ];

    var query = `INSERT INTO ${tablename} 
      (content, tags, date, edited, likes, quotes, is_quote, quote_origin, like_list) 
      VALUES ($1, $2::VARCHAR(19)[], NOW(), $3, $4, $5, $6, $7::JSON, $8::text[])`
    ;

    var res = await client.query(query, args);
      
    rows = res.rows;
    await client.query('COMMIT');

  } catch(e) {
    await client.query('ROLLBACK');
    console.log(`Error caught by error handler: ${ e }`);
  }
  finally {
    client.release();
  }
  return (rows.length === 0 ? false : true);
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
  var rows = [];

  try {
    var tablename = userSpinTableName(user_poster);
    
    await client.query('BEGIN');
   
    var args = [spin.id];
    var query = `SELECT like_list FROM ${tablename} 
    WHERE id = $1`;

    var res = await client.query(query, args);

    if (res[0].indexOf(user_like.username) > -1) {
      console.log("user_liker has already liked the spin")
      return false;
    } 
    else {

      res[0].push(user_liker.username);
      args = [res[0], spin.id];
      query = `UPDATE ${tablename} 
      SET 
      likelist = $1, 
      likes = likes + 1
      WHERE id = $2`;

      res = await client.query(query, args);
      
      rows = res.rows;

      await client.query('COMMIT');
    }
  } catch(e) {
    await client.query('ROLLBACK');
    console.log(`Error caught by error handler: ${ e }`);
  }
  finally {
    client.release();
  }
  return (rows.length === 0 ? false : true);
};

// funtion decrements like number of the spin by 1
// check that user_liker has already liked the spin
// check that user_liker is removed from the spin's like_list
// @param user_liker: username of user which is unliking the spin
// @param user_poster: username of user which is poster of spin
// @param spin: spin which is being unliked
// @return true on success and false on failure
async function unlikeSpin(user_liker, user_poster, spin) {
  const client = await pool.connect();
  var rows = [];

  try {
    var tablename = userSpinTableName(user_poster);
    await client.query('BEGIN');
    
    var args = [spin.id];
    var query = `SELECT like_list FROM ${tablename} 
    WHERE id = $1`;

    var res = await client.query(query);
    var index = res[0].indexOf(user_like.username);
    if (index > -1) {

      res[0].splice(index, 1);
      
      args = [res[0], spin.id];
      query = `UPDATE ${tablename} 
      SET 
      likelist = $1, 
      likes = likes - 1
      WHERE id = $2`;

      res = await client.query(query);

      rows = res.rows;

      await client.query('COMMIT');
    } else {
      console.log("user_liker has not liked the spin")
      return false;
    }
  } catch(e) {
    await client.query('ROLLBACK');
    console.log(`Error caught by error handler: ${ e }`);
  }
  finally {
    client.release();
  }
  return (rows.length === 0 ? false : true);
};

async function reSpin(user, res) {

};

async function getQuoteOrigin(user, res) {

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
  getQuoteOrigin,
  createUser,
  userExists,
  deleteUser,
  updateLoginTime
};