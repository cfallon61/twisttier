
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
async function postCreateUser(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(406).json({ errors: errors.array() });
    return;
  }

  var accountInfo = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    username: req.body.username,
    bio: req.body.bio
  };

  var userCreated = await db.createUser(accountInfo);

  if (userCreated != true) {
    res.status(406).json({ errors: userCreated });
  }
  else {
    // TODO add sessions
    res.redirect('/profileImage');// TODO create this form
  }
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
    console.log('invalid password')
    res.setHeader('Error', 'Incorrect Password');
    return next();
  }
  else {
    console.log('authenticated');
    db.updateLoginTime(user.username);
    return next();
  }
}


// function to authorize the account - either returns true meaning account
// is authorized, false otherwise. 
// boolean value can be used in the front end to navigate to page required.
var authorizeAccount = async function (user) {

  var exist = await db.userExists(user);

  if (!exist){
    return false;
  }
  
  // compare the passwords
  var match = await bcrypt.compare(user.password, userData[0].passhash);
 
  // password doesn't match
  if (!match){
    return false;
  }
  else {
    db.updateLoginTime(user.username);
    return true;
  }
  return false;
}


function deleteAccount() {

}

function editAccount() {

}




module.exports = {
  postCreateUser,
  authorize,
  deleteAccount,
  editAccount,
  authorizeAccount
};