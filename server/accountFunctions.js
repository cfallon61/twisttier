const db = require('./dbFunctions');
const bcrypt = require('bcrypt');
const extFuncs = require('./helpers.js');
const path = require('path');
const express = require('express');
const reservedTag = require('./config.json').reservedTag;



// checking new push
// @desc: express middleware function to interface with the database
// @return: none
async function postCreateUser(req, res, next) {

  // TODO figure out why express-validator isnt working
  if (extFuncs.check_errors(req, res)) {
    // return next();
  }

  var profile_pic_path = null;
  // if there is a file then add it to the thing
  console.log(req.file);
  console.log(req.file);
  if (req.file.path) {
    profile_pic_path = req.file.path;
  }
  console.log('profile picture located at', profile_pic_path);

  var accountInfo = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    username: req.body.username,
    bio: req.body.bio,    
    profile_pic: profile_pic_path,
  };
  
  // check if the user exists already
  var existing = await db.userExists(accountInfo);
  if (existing != false) {
    console.log(accountInfo.username + ' already exists')
    // because of the way that this works, it will upload a profile image first.
    // if the image gets uploaded but the username already exists, then we want to 
    // delete the image that got uploaded so we don't just rack up tons of files
    // and get DDoSed
    res.setHeader('error', 'user exists');
    extFuncs.delete_profile_img(accountInfo.profile_pic);
    return next(); // return the rows
  }

  var userCreated = await db.createUser(accountInfo);
 
  // userCreated is the empty rows or false, return error
  if (!userCreated.username) {
    // console.log(userCreated);
    res.setHeader('error', userCreated);
  } 
  else {
    res.userdata = userCreated;
    res.setHeader('username', userCreated.username);
  }
  return next();
} 

// @desc: function used for logging in (idk why its not called login but whatever)
// @return: none
//          sends response 401 unauthorized with a set header specifying what went wrong
async function authorize(req, res, next) {
  const user = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  };
  console.log("body =", req.body);

  if (!user.password && !user.username || !user.password && !user.email) {
    res.setHeader('error', 'invalid user');
    return next();
  }

  // console.log(user);

  var userData = await db.userExists(user);

  if (userData === false) {
    console.log('invalid username');
    res.setHeader('error', 'Username invalid');
    return next();
  }
  try {
    var match = await bcrypt.compare(user.password, userData.passhash);
  }
  catch (e) {
    console.log('exception occurred in authorize: ', e);
    res.setHeader('error', "unable to authorize");
    return next();
  }
  // console.log(match);
  // password doesn't match
  if (!match) {
    console.log('invalid password');
    res.setHeader('error', 'Incorrect Password');
  } 
  else {
    if (typeof user.username === 'undefined' || user.username === "") {
      //1st index is the username
      user.username = userData.username;
    }
    // attempt to update the user's last login time
    const updateLoginTimeBool = await db.updateLoginTime(user);

    // check whether login time was successfully updated
    if (!updateLoginTimeBool) {
      console.log('Login time could not be updated');
      res.setHeader('error', 'Login time could not be updated');
    }
  }
  console.log(userData);
  res.userdata = {
    username: userData.username,
    profile_pic: userData.profile_pic,
    last_login: userData.last_login,
  };
  res.setHeader('username', userData.username);
  return next();

}

// checks whether the account to be deleted exists or not, deletes it,
// returns error or success response
async function deleteAccount(req, res, next) {
  // extract info from the request
  const user = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  };
  // console.log("user =", user);
  var userData = await db.userExists(user);
  // console.log(userData);
  try {
    var goodPass = await bcrypt.compare(user.password, userData.passhash);
  }
  catch (e) {
    console.log('exception occurred while deleting account:', e);
    res.setHeader('error', 'deletion failed');
    return next();
  }
  // check if the user exists
  // if it exists, call the delete user function of db
  if (userData !== false && goodPass) {

    var deleteSuccess = await db.deleteUser(req.body.username);

    if (deleteSuccess) {
      extFuncs.delete_profile_img(userData.profile_pic);
      return next();
    } 
    else {
      res.setHeader('error', 'deletion failed');
    }
  } 
  else {
    res.setHeader('error', 'deletion failed: bad password');
  }
  return next();

}

// API for frontend development
async function getUserInfo(req, res, next) {
  console.log('get user info')
  var user = {
    // send the username as a url parameter ex: /api/users/bringMeDeath
    username: req.params.username,
  }

  var data = await db.userExists(user);
  if (!data) {
    res.setHeader('error', 'user not found');
  } 
  else {
    // protect certain information such as password
    var responseObject = {
      username: data.username,
      bio: data.bio,
      create_date: data.create_date,
      last_login: data.last_login,
      name: data.name,
      followers: data.followers,
      following: data.following,
      interests: data.interests,
      profile_pic: data.profile_pic,
    };
    // console.log(responseObject);
    // TODO change this to not be a .json response
    // need to get clever with how to send response back
    res.json(JSON.stringify(responseObject));

  }
  // console.log(res);
  return next();
}


// @brief: copy pasta from getTimeline because I am lazy
//         same thing, but does a hack which converts the
//         user list to a following list.
async function getPosts(req, res, next) {
  var user = {
    username: req.params.username,
  };
  // get user's data
  var data = await db.userExists(user);

  if (data === false) {
    res.setHeader('error', 'user not found');
    return next();
  }
  var request = {
    users: JSON.stringify([{
      username: user.username,
      tags: []
    }])
  }
  var spins = await db.getSpins(request);

  if (spins.length === 0) {
    res.setHeader('alert', 'no spins found :(')
  }
  // console.log(spins);
  res.json(JSON.stringify(spins));
  return next();

  // TODO error check here and make sure that it returns good data
}

// @brief: generic get timeline function
//         will also be used for when typing in a user's username in
//         the address bar. this wont work i don't think
async function getTimeline(req, res, next) {
  var user = {
    username: req.params.username,
  };
  // get user's data
  var data = await db.userExists(user);

  if (data === false) {
    res.setHeader('error', 'user not found');
    return next();
  }

  var following = data.following;
  // console.log(following);

  var followedSpins = await db.getSpins(following);

  if (followedSpins.length === 0) {
    res.setHeader('alert', 'no spins found :(')
  }
  // console.log(followedSpins);
  res.json(JSON.stringify(followedSpins));
  // return next();

  // TODO error check here and make sure that it returns good data

}

// updates user profile information from request
async function updateProfileInfo(req, res, next) {

  if (extFuncs.check_errors(req, res)) {
    // return next();
  }
  var imgsrc = null;
  
  if (req.file.path) {
    imgsrc = req.file.path;
  }
  var user = {
    username: req.params.username,
    password: req.body.password,
    bio: req.body.bio,
    name: req.body.name,
    interests: req.body.interests,
    accessibility_features: req.body.accessibility_features,
    profile_pic: imgsrc
  };
  console.log(req.params, "\n", req.body, "\n", user);

  // get user's profile data so i can be lazy
  var userData = await db.userExists(user);

  if (!userData) {
    res.setHeader('error', "unable to update");
    console.log('unable to update user idk what happened');
    extFuncs.delete_profile_img(req.file.path);
    return next();
  }

  // if no new profile picture is provided, set the new one to be the current one
  if (!user.profile_pic) {
    user.profile_pic = userData.profile_pic;
  }
  // if one is provided, set a parameter in the request object to point to the old 
  // profile picture path and then delete that image
  else {
    req.imgsrc = userData.profile_pic;
    extFuncs.delete_profile_img(req, res);
  }

  // attempt to update the user's crap
  userData = await db.updateUser(user);

  // if all checking fine, update the user
  if (userData === false) {
    // if use use header, we need to return next
    res.setHeader('error', 'user not found');
  } 
  else {
    res.setHeader('username', userData.username);
    res.userdata = userdata;
    req.imgsrc = userdata.profile_pic;
  }
  return next();

}

async function updateFollowing(req, res, next) {
  const action = req.params.action;
  const toFollow = req.params.toFollow;
  const tags = req.params.tags;
  const follower = req.params.follower;
  var followUpdate;
  var user = { username: toFollow };
  
  // don't allow for following or unfollowing of yourself.
  if (toFollow === follower) {
    res.setHeader('error', 'nice try bucko you can\'t do that though.');
    return next();
  }
  // auto follow all __new posts
  // 
  tags.push(reservedTag);

  // make sure tofollow exists probably not necessary.
  const userData = await db.userExists(user);
  if (!userData) {
    res.setHeader('error', toFollow + ' does not exist');
    return next();
  }

  if (action === "follow") {
    followUpdate = await db.followTopicUserPair(follower, toFollow, tags);
  }
  else if (action === "unfollow") {
    followUpdate = await db.unfollowTopicUserPair(follower, toFollow, tags);
  }
  else {
    res.setHeader('error', "invalid action");
    return next(); 
  }

  if (!followUpdate) {
    res.setHeader('error', "unable to " + action + " " + toFollow);
    return next();
  }
  else {
    res.json(JSON.stringify(followUpdate));
  }
}



module.exports = {
  postCreateUser,
  authorize,
  deleteAccount,
  getTimeline,
  updateProfileInfo,
  getUserInfo,
  getPosts,
  updateFollowing,
};
