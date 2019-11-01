const {check, validationResult} = require('express-validator');
const express = require('express');
const fs = require('fs');
const { config, uploader } = require('cloudinary');
const datauri = require('datauri');
const multer = require('multer');
const path = require('path');


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

function getExtension(filename) {
  const index = filename.lastIndexOf(".");
  var ext =  filename.substring(index);
  return ext.toLowerCase();
}


const uri = new datauri();

const cloudinaryConfig = (req, res, next) => 
{
  config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API,
    api_secret: process.env.CLOUD_SECRET,
  });
  next();
}
const dataUri = req => uri.format(path.extname(req.file.originalname).toString(), req.file.buffer);


// setup multer with upload desination for images
const storage = multer.diskStorage({

  destination: './profileImages',

  // handle filename creation
  filename: function(req, file, cb) {

    try {
      
      var tempName = Date.now().toString() + "_" + file.originalname;
      var filepath = path.join(images, tempName);
      console.log('filepath =', filepath);
      // console.log(filepath);
      // super hacky way of doing the file name handling
      while (fs.existsSync(filepath)) {
        filepath = path.join(images, tempName);
        tempName = Date.now().toString() + "_" + file.originalname;
      }
      console.log('filename =', tempName, 'file =', file);

      cb(null, tempName);
    }
    catch (e) {
      console.log('Multer.storage encountered an error:', e);
      return cb(null, undefined);
    }
  }
});

// configure other multer params
const multerUpload = multer({
  storage: multer.memoryStorage(),

  fileFilter: function(req, file, next) {
    console.log('filtering files');
    if (!file) return next(null, false);
    try {
      console.log(file);
      var ext = getExtension(file.originalname);
      // console.log(ext);
      // var ext = path.extname(file.originalname).toLocaleLowerCase()
      if (ext != '.png' && ext != '.jpg' && ext != '.jpeg' && ext != '.gif') {
        console.log("unable to upload profile image: " + ext + " is an invalid filetype");
        req.error = "unable to upload profile image: " + ext + " is an invalid filetype"
        return next(null, false);
      }
   
      return next(null, true);
    }
    catch (e) {
      console.log('Multer.upload encountered an error:', e);
      return next(null, false);
    }
  },

  limits: {
    fileSize: 1024 * 1024 * 1024 * 5
  } // 5 MB

}).single('profileImage');

function cloudinaryUpload(req, res, next)
{
  if (req.error)
  {
    res.setHeader('error', req.error);
  }
  if (!req.file) 
  {
    res.setHeader("error", 'unable to upload image for whatever reason');
    req.file.path = '';
    return next();
  }
  // console.log('file provided:', req.file);
  const file = dataUri(req).content;
  // console.log(file);
  uploader.upload(file).then((result) => {
    // if (err) console.log('error occurred at other upload:', err);
    // console.log('result =',result);
    req.file.path = result.secure_url;
    // const image = result.url;
    console.log(req.file);
    return next();
  }).catch((err) => {
    res.setHeader('error', 'unable to upload image');
    console.log('error occurred at other upload:', err);
    return next();
  });

}

// @brief Function for finding and deleting an old profile image
// @return: true on success, false on fail
function delete_profile_img(imgpath) {
  uploader.destroy((imgpath), (err, res) =>
  {
    if (err)
    {
      console.log(err);
      return false;
    }
    console.log('result of destroying ', imgpath, res);
    return true;
  });
  
}


// @brief: Create a user session and set relevant headers
function createSession(req, res) {
  req.clientSession.uid = res.getHeader('username');
  // console.log('client session =',req.clientSession);
  res.setHeader("loggedIn", true);
  res.cookie('username', req.clientSession.uid, {
    maxAge: 100 * 60 * 60 * 24
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
  // console.log(req.session);
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
  cloudinaryUpload,
  multerUpload,
  cloudinaryConfig,

}