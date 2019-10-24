const {check, validationResult} = require('express-validator');
const express = require('express');
const fs = require('fs');


// @brief generic function for checking if a request has invalid input.
// @return: true if there are errors present, false if none
function check_errors(req, res) {
  const errors = validationResult(req);

  // verify that the spin fits within the length bounds
  if (!errors.isEmpty()) {
    // console.log(errors.array());
    res.setHeader('error', JSON.stringify(errors.array()));
    return true;
  }

  return false;
}


// @brief Function for finding and deleting an old profile image
// @return: true on success, false on fail
function delete_profile_img(req, res) {
  const imgpath = req.imgsrc;
  var ret = false;
  if (fs.existsSync(imgpath)) {
    fs.unlink(imgpath, (err) => { 
      if (err) console.log(err);
    });
    ret = true;
  }
  return ret;
}


// @brief: Create a user session and set relevant headers
function createSession(req, res) {
  req.clientSession.uid = res.getHeader('username');
  // console.log('client session =',req.clientSession);
  res.setHeader("loggedIn", true);
  res.cookie('username', req.clientSession.uid, {
    maxAge: 60 * 60 * 24
  });
}

// @brief: delete a client session
// @author: Chris Fallon
function deleteSession(req, res) {

  if (req.clientSession.uid) {
    req.clientSession.uid = null;
    req.clientSession.destroy((err) => { if (err) throw err; });
    res.clearCookie('clientSession');
  }
  if (req.cookies.username) {
    req.cookies.username = null;
    res.clearCookie('username')
  }
  console.log(req.clientSession, req.cookies);
  return 0;
}

function loggedIn(req, res, next) {
  // if logged in continue, else redirect to wherever
  if (req.clientSession.uid && req.cookies.username) {
    res.setHeader("loggedIn", true);
    console.log(req.clientSession.uid, 'is logged in');
    return next();
  } else {
    res.redirect('/'); // TODO route this however
  }
};

function notLoggedIn(req, res, next) {
  console.log(req.cookies);
  console.log(req.clientSession);
  if (!req.clientSession.uid || !req.cookies.username) {
    console.log('user is not logged in')
    return next();
  } else {
    res.redirect('/');
  }
};

module.exports = {
  check_errors,
  notLoggedIn,
  deleteSession,
  createSession,
  loggedIn,
  delete_profile_img,
}