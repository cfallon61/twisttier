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
const TEST = (process.env.TEST === "true");


// query the database to see if the user exists
// parameter user is object of form {email: [email], username: [username]}
// @return: object of all user's data
var userExists = async function (user) {
  
  var params = [];
  // console.log(user);
  var query = `SELECT * FROM ${USER_TABLE} `;

  if(user.username)
  {
    query += `WHERE USERNAME=$1`;
    params.push(user.username);
  }
  else if(user.email)
  {
    query += `WHERE EMAIL=$1`;
    params.push(user.email);
  }
  else {
    //Unexpected error here.
    console.log("what the fuck")
    return false;
  }
  var res = await pool.query(query, params);

  // response is a json 
  // need to get rows, which is a list
  // console.log(res);
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
// @return: object containing creation info if creation successful, 'unable to create user' if not
 async function createUser(accountInfo) {

  // check if the user exists already
  var existing = await userExists(accountInfo);
  if (existing != false){
    console.log(accountInfo.username + ' user already exists')
    return existing; // return the rows
  }
  // console.log('create user called')
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
    // console.log("REACHED, tablename: ", tablename, SPIN_TEMPLATE);
    var res = await client.query(query);

    // console.log(accountInfo);

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
      accountInfo.profile_pic,
    ];

    query = `INSERT INTO ${USER_TABLE} (email, 
      username, passhash, create_date, last_login, bio, 
      name, followers, following, interests, accessibility_features, profile_pic) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8::VARCHAR(15)[], $9::JSON, $10::VARCHAR(20)[], $11::JSON, $12::TEXT) 
      RETURNING username, profile_pic, last_login`;

    res = await client.query(query, args);
    // console.log("2nd res: ", res.rows);
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
  // console.log(rows);

  return (rows.length === 0 ? 'unable to create user' : rows[0]);
};


// function that deletes user info
// this function is to be called after the server has properly authenticated
// @param username: the user's username
// @return deleted username on success, error on failure
async function deleteUser(username){
  const client = await pool.connect();
  var rows = [];

  try{

    var tablename = userSpinTableName(username);
    
    await client.query('BEGIN');

    // delete spin table
    var query =  `DROP TABLE ${tablename}`;

    var res = await client.query(query);

    query = `DELETE FROM ${USER_TABLE} WHERE username=$1 RETURNING username`;

    // query = `SELECT * FROM ${USER_TABLE} WHERE username=$1`;
    var res = await client.query(query, [username]);
    await client.query('COMMIT');
    
    rows = res.rows;
    
  } 
  catch (e) {
    await client.query('ROLLBACK');
    // console.log(`Error caught by error handler: ${ e }`);
    // return e;
  } 
  finally {
    client.release();
  }
  // console.log("Rows: ", rows);
  // console.log(rows.length === 0 ? false : rows[0].username);
  return (rows.length === 0 ? false : rows[0].username);
  
};

// function to update user info (used by edit account)
// returns username, last_login, and profile_pic link of user on success and false on failure
async function updateUser(user) {
  // get user's profile data so i can be lazy
  var userData = await userExists(user);

  if (!user.profile_pic) {
    user.profile_pic = userData.profile_pic;
  }

  // extract the info to be inserted
  if (user.password != undefined) {
    var hash = await bcrypt.hash(user.password, 10);
  }
  // connect to database
  var client = await pool.connect();
  var rows = [];

  try {
    // begin transaction
    await client.query('BEGIN');

    var args = [
      user.username,
      hash, 
      user.bio, 
      user.name, 
      user.interests,
      user.accessibility_features,
      user.profile_pic
    ];

    var query = `UPDATE ${USER_TABLE} SET passhash = $2, bio = $3, name = $4, interests = $5, 
      accessibility_features = $6, profile_pic = $7 WHERE username = $1 
      RETURNING username, profile_pic, last_login`
    ;

    if (user.password === undefined) {
      args.splice(1,1);
      query = `UPDATE ${USER_TABLE} 
        SET bio = $2, name = $3, interests = $4, accessibility_features = $5, profile_pic = $6
        WHERE username = $1 RETURNING username, profile_pic, last_login`
      ;
    }

    var res = await client.query(query, args);
    rows = res.rows;
    // console.log("ROWS: ", rows);
    
    // end transaction
    await client.query('COMMIT');
  }
  catch (e) {
    await client.query('ROLLBACK');
    console.log(e);
  }
  finally {
    client.release();
  }
  
  // returns id of user if success otherwise false
  return (rows.length === 0 ? false : rows[0]);
}

// Function to update the last login time
// return true on success, false on error
async function updateLoginTime(user){
  var client = await pool.connect();
  var rows;
  var query = `UPDATE ${USER_TABLE} SET last_login = NOW() WHERE`;
  var arg = '';
  if (!user.username)
  {
    query +=` email = $1 RETURNING username`;
    arg = user.email;
  }
  else {
    query += ` USERNAME = $1 RETURNING username`;
    arg = user.username;
  }
  console.log(query)
  try{
    // console.log(user);
    await client.query('BEGIN');
    // const tablename = userSpinTableName(username);
    var res = await client.query(query, [arg]);
    // var res = await client.query(query);
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
  // console.log(res.rows);
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
  query += ' ORDER BY date DESC';
  
  console.log(query);
  var res = await pool.query(query, tagList);
  return res.rows;
};

// Adds the users spin into their spin table
// @param user = user who created the spin
// @param spin = spin to be added into the user's spin table
// @return spin id if success, false if failure
async function addSpin(username, spin) {
  const client = await pool.connect();
  var rows = [];

  try {
    var tablename = userSpinTableName(username);
    await client.query('BEGIN');

    var args = [
      spin.content,
      spin.tags,
      spin.edited,
      spin.likes,
      spin.quotes,
      spin.is_quote,
      JSON.stringify(spin.quote_origin),
      spin.like_list
    ];

    var query = `INSERT INTO ${tablename} 
      (content, tags, date, edited, likes, quotes, is_quote, quote_origin, like_list) 
      VALUES ($1, $2::VARCHAR(19)[], NOW(), $3, $4, $5, $6, $7::JSON, $8::text[]) 
      RETURNING id`
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
  return (rows.length === 0 ? false : rows[0].id);
};


async function deleteSpin(username, spin_id) {
  const client = await pool.connect();
  var rows = [];

  try {
    var tablename = userSpinTableName(username);
    await client.query('BEGIN');

    var query = 
      `DELETE FROM ${tablename} 
      WHERE id=$1 
      RETURNING id`
    ;

    var res = await client.query(query, [spin_id]);
    rows = res.rows;
    await client.query('COMMIT');
    
  } catch(e) {
    await client.query('ROLLBACK');
    console.log(`Error caught by error handler: ${ e }`);
  }
  finally {
    client.release();
  }
  return (rows.length === 0 ? false : rows[0].id);
}

async function showNotification(user, res) {

};

async function followTopicUserPair(username, tofollow, tags) {
  const client = await pool.connect();
  var rows = [];

  try{
    
    await client.query('BEGIN');

    var args = [
      username
    ];

    var query = `SELECT follwing FROM ${USER_TABLE} WHERE username = $1`;

    var res = await client.query(query, [args]);
    
    var add = res[0];
    var b = -1;
    for (var i = 0; i < add.users.length(); i++) {
      if (add.users[i].username === tofollow) {
        b = i;
      }
    }
    if (b === -1) {
      var follow = {};
      var key1 = 'username';
      var key2 = 'tags';
      follow[key1] = username;
      follow[key2] = tags;
      add.users.push(follow);
    }
    else {
      for (var i = 0; i <tags.length(); i++) {
        add.users[b].tags.push(tags[i])
      }
    }

    args = [
      username,
      add
    ];

    var query = `UPDATE ${USER_TABLE} 
      SET following = $2
      WHERE username = $1 
      RETURNING username`
    ;

    var res = await client.query(query, [args]);

    await client.query('COMMIT');
    rows = res.rows;

  } 
  catch (e) {
    await client.query('ROLLBACK');
    // console.log(`Error caught by error handler: ${ e }`);
    // return e;
  } 
  finally {
    client.release();
  }
  // console.log("Rows: ", rows);
  // console.log(rows.length === 0 ? false : rows[0].username);
  return (rows.length === 0 ? false : rows[0].username);
};

async function unfollowTopicUserPair(pair) {

};

// funtion increments like number of the spin by 1
// check that user_liker hasn't already liked the spin
// check that user_liker is added to spin's like_list
// @param user_liker: username of user which is liking the spin
// @param user_poster: username of user which is recieveing the like on his spin
// @param spin: spin which is being liked
// @return the spin which was liked on success and false on failure
async function likeSpin(user_liker, user_poster, spin) {
  const client = await pool.connect();
  var rows = [];

  try {
    var tablename = userSpinTableName(user_poster);
    
    await client.query('BEGIN');
   
    var args = [spin];
    var query = `SELECT like_list FROM ${tablename} WHERE id = $1`;

    var res = await client.query(query, args);
    var like_list = res.rows[0].like_list;
    // console.log(like_list);

    // check that the user has not already liked the spin
    if (like_list.indexOf(user_liker) > -1) {
      console.log(user_liker + " has already liked the spin")
      await client.query('ROLLBACK');
      return false;
    } 
    else {

      like_list.push(user_liker);
      args = [like_list, spin];
      query = `UPDATE ${tablename} SET like_list = $1, likes = likes + 1 WHERE id = $2 RETURNING *`;

      res = await client.query(query, args);
      
      rows = res.rows;
      // console.log(rows);
      await client.query('COMMIT');
    }
  } catch(e) {
    await client.query('ROLLBACK');
    console.log(`Error caught by error handler: ${ e }`);
  }
  finally {
    client.release();
  }
  return (rows.length === 0 ? false : rows);
};

// funtion decrements like number of the spin by 1
// check that user_liker has already liked the spin
// check that user_liker is removed from the spin's like_list
// @param user_liker: username of user which is unliking the spin
// @param user_poster: username of user which is poster of spin
// @param spin: spin which is being unliked
// @return the spin which was unliked on success and false on failure
async function unlikeSpin(user_liker, user_poster, spin) {
  const client = await pool.connect();
  var rows = [];

  try {
    var tablename = userSpinTableName(user_poster);
    await client.query('BEGIN');
    
    var args = [spin];
    var query = `SELECT like_list FROM ${tablename} 
    WHERE id = $1`;

    var res = await client.query(query, args);
    // get the like list from the response object
    var like_list = res.rows[0].like_list;

    var index = like_list.indexOf(user_liker);
    // if the user is found in the like list then we remove the name
    // and write to the database
    if (index > -1) {

      like_list.splice(index, 1);
      
      args = [like_list, spin];
      query = `UPDATE ${tablename} SET likelist = $1, likes = likes - 1 
      WHERE id = $2 RETURNING *`;

      res = await client.query(query);

      rows = res.rows;

      await client.query('COMMIT');
    } 
    else {
      console.log(user_liker + " has not liked the spin")
      await client.query("ROLLBACK");
      return false;
    }
  } catch(e) {
    await client.query('ROLLBACK');
    console.log(`Error caught by error handler: ${ e }`);
  }
  finally {
    client.release();
  }
  return (rows.length === 0 ? false : rows[0]);
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
  createUser,
  userExists,
  deleteUser,
  updateLoginTime,
  updateUser,
  deleteSpin
};