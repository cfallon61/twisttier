const {
  check,
  validationResult
} = require('express-validator');
const db = require('./dbFunctions');
const extFuncs = require('./helpers.js');
const express = require('express');


// @brief: middleware to create a post. sets 'error' header if
//         errors occur
// @return: none
async function createSpin(req, res, next) {
  if (extFuncs.check_errors(req, res)) {
    // return next();
  }

  var spin = {
    content: req.body.spinBody,
    tags: req.body.tags,
    edited: false,
    likes: 0,
    quotes: 0,
    is_quote: req.body.is_quote,
    quote_origin: req.body.quote_origin, // TODO define how this works I still don't understand the whole quote origin thing
    like_list: []
  };

  // if it is a quote but no original author is specified, error
  if (spin.is_quote && spin.quote_origin === undefined) {
    res.setHeader("error", "no quote origin specified");
    return next();
  }


  var added = await db.addSpin(req.params.username, spin);
  console.log(added);
  if (!added) {
    res.setHeader("error", "unable to add spin");
  } else {
    res.setHeader("spinId", added);
  }
  return next();
}

// @brief: middleware to delete a post. sets 'error' header if
//         errors occur
// @return: none
async function removeSpin(req, res, next) {
  if (extFuncs.check_errors(req, res)) {
    // return next();
  }
  var username = req.params.username
  var spin_id = req.body.spinId;

  var deleted = await db.deleteSpin(username, spin_id);
  if (!deleted) {
    res.setHeader("error", "unable to delete spin");
  } else {
    res.setHeader("spinId", deleted);
  }
  return next();
}


async function esteemSpin(req, res, next) {
  var liker = req.params.username;
  var author = req.params.spinAuthor;
  var spinId = req.params.spinId;
  var action = req.params.action;

  var result;

  if (action === 'like') {
    result = await db.likeSpin(liker, author, spinId);
  }
  else if (action === 'unlike') {
    result = await db.unlikeSpin(liker, author, spinId);
  }
  
  // if the action was not able to be completed, set an error header and return next
  // else send the post and die
  if (!result) {
    res.setHeader('error', 'unable to ' + action + ' post');
    return next();
  }
  else {
    res.JSON(JSON.stringify(result));
  }
}


module.exports = {
createSpin,
removeSpin,
esteemSpin,
}