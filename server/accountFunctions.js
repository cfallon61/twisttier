
const { check, validationResult } = require('express-validator');
const db = require('./dbFunctions');
const express = require('express');
const bcrypt = require('bcrypt');
const path   = require('path');
const index  = path.join(__dirname, '../build/index.html');

function validUsername(username){

}

// @desc: express middleware function to interface with the database
// @return: none
async function postCreateUser(req, res, next) {
  const errors = validationResult(req);

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
  };

  var userData = await db.userExists(user);

  if (userData === false)
  {
    console.log('invalid username');
    res.setHeader('Error', 'Username invalid');
    return next();
  }
  var match = await bcrypt.compare(user.password, userData[0].passhash);
 
  // password doesn't match
  if (!match){
    console.log('invalid password');
    res.setHeader('Error', 'Incorrect Password');
    return next();
  }
  else {
    console.log('authenticated');
    updateLoginTimeBool = db.updateLoginTime(user.username);
    
    // check whether login time was successfully updated
    if (!updateLoginTimeBool) {
      console.log('Login time could not be updated');
      res.setHeader('Error', 'Login time could not be updated');
      return next();
    }

    return next();
  }
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

}

function editAccount(req, res, next) {

}

async function addInterest(req, res, next){

}

async function removeInterest(req, res, next) {

}




module.exports = {
  postCreateUser,
  authorize,
  deleteAccount,
  editAccount,
};