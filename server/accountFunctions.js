
const { check, validationResult } = require('express-validator');
const db = require('./dbFunctions');
const express = require('express');
const bcrypt = require('bcrypt');



// checking new push
// @desc: express middleware function to interface with the database
// @return: none
async function postCreateUser(req, res, next) {
  const errors = validationResult(req);

  console.log('postCreateUser called');
  console.log(req.body);

  if (!errors.isEmpty()) {
    res.setHeader('error', errors.array());
    return next();
  }
  var accountInfo = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    username: req.body.username,
    bio: req.body.bio
  };

  var userCreated = await db.createUser(accountInfo);

  // userCreated is the empty rows or false, return error
  if (userCreated != true) {
    res.setHeader('errors', userCreated);
  }

  return next();
}

// @desc: function used for logging in (idk why its not called login but whatever)
// @return: none
//          sends response 401 unauthorized with a set header specifying what went wrong
async function authorize(req, res, next) {
  const user = {
    username : req.body.username,
    password : req.body.password,
    email : req.body.email
  };

  // console.log(user);
  
  var userData = await db.userExists(user);
  // console.log(userData);

  if (userData === false)
  {
    console.log('invalid username');
    res.setHeader('Error', 'Username invalid');
    return next();
  }
  var match = await bcrypt.compare(user.password, userData.passhash);
 
  // password doesn't match
  if (!match){
    console.log('invalid password');
    res.setHeader('Error', 'Incorrect Password');
  }
  else {
    if(typeof user.username === 'undefined' || user.username === "")
    {
      //1st index is the username
      user.username = userData[1];
    }
    updateLoginTimeBool = db.updateLoginTime(user.username);
    
    // check whether login time was successfully updated
    if (!updateLoginTimeBool) {
      console.log('Login time could not be updated');
      res.setHeader('Error', 'Login time could not be updated');
    }
  }
  return next();

}

// checks whether the account to be deleted exists or not, deletes it,
// returns error or success response
async function deleteAccount(req, res, next) {
  // extract info from the request
  const user = {
    username : req.body.username,
    password : req.body.password,
    email : req.body.email
  };

  var exist = await db.userExists(user);
  
  // check if the user exists
  // if it exists, call the delete user function of db
  if (exist !== false) {
    
    var deleteSuccess = await db.deleteUser(req.body.username);

    if (deleteSuccess){
      return next();
    } 
    else {
      res.setHeader('error', 'deletion failed');
    }
  } 
  else {
    res.setHeader('error', 'deletion failed');
  }
  return next();

}

// API for frontend development
async function getUserInfo(req,res, next) {
  console.log('get user info')
  var user = {
    // send the username as a url parameter ex: /api/users/bringMeDeath
    username: req.params.username,
  }

  var data = await db.userExists(user);
  if (!data){
    res.setHeader('error', 'user not found');
  }
  else {
    // protect certain information such as password
    var responseObject = {
      username: data.username,
      bio :  data.bio,
      create_date: data.create_date,
      last_login: data.last_login,
      name: data.name,
      followers: data.followers,
      following: data.following,
      interests: data.interests,
      profile_pic: data.profile_pic,
    };
    // console.log(responseObject);
    res.json(JSON.stringify(responseObject));
    
  }
  // console.log(res);
  return next();
}

async function addInterest(req, res, next){

}

async function removeInterest(req, res, next) {

}


// @brief: copy pasta from getTimeline because I am lazy
//         same thing, but does a hack which converts the 
//         user list to a following list. 
async function getPosts(req, res, next){
  var user = {
    username: req.params.username,
  };
  // get user's data
  var data = await db.userExists(user);

  if (data === false) {
    res.setHeader('error', 'user not found');
    return next();
  }
  var request = { users: JSON.stringify([{ username: user.username, tags: [] }]) }
  var spins = await db.getSpins(request);

  if (spins.length === 0) {
    res.setHeader('alert', 'no spins found :(')
  }
  console.log(spins);
  res.json(JSON.stringify(spins));
  return next();

  // TODO error check here and make sure that it returns good data
}

// @brief: generic get timeline function
//         will also be used for when typing in a user's username in 
//         the address bar. this wont work i don't think
async function getTimeline(req, res, next){
  var user = {
    username : req.params.username,
  };
  // get user's data
  var data = await db.userExists(user);

  if (data === false){
    res.setHeader('error', 'user not found');
    return next();
  }

  var following = data.following;
  // console.log(following);
  
  var followedSpins = await db.getSpins(following);

  if (followedSpins.length === 0){
    res.setHeader('alert', 'no spins found :(')
  }

  res.json(JSON.stringify(followedSpins));
  return next();
  
  // TODO error check here and make sure that it returns good data
  
}

// updates user profile information from request
async function updateProfileInfo(req,res, next) {
  var user = {
    id: req.body.id,
    password: req.body.password,
    bio: req.body.bio,
    name: req.body.name,
    interests: req.body.interests,
    accessibility_features: req.body.accessibility_features,
    profile_pic: req.body.profile_pic
  };

  // TODO: might need to do some checking, depending on logic of frontend

  // if all checking fine, update the user
  var response = await db.updateUser(user);

  if (response === false){
    // if use use header, we need to return next
    res.setHeader('error', 'user not found');
  } else {
    res.setHeader('message', 'user updated');
  }
  return next();


}


module.exports = {
  postCreateUser,
  authorize,
  deleteAccount,
  getTimeline,
  updateProfileInfo,
  getUserInfo,
  getPosts
};