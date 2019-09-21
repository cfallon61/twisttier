const { check, validationResult } = require('express-validator');
const db = require('./dbFunctions');


async function postCreateUser(req, res){
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(406).json({ errors: errors.array() });
    return;
  }

  var accountInfo = {
    email: req.body.email,
    password: req.body.db.passHash(password), // TODO CHANGE THIS TO CREATE A HASH
    name: req.body.name,
    username: req.body.username,
    bio: req.body.bio
  };

  var userCreated = await db.createUser(accountInfo);

  if (userCreated != true) {
    res.status(406).json({ errors: userCreated });
  }
  else {
    res.redirect('/profileImage');// TODO create this form
    // res.send("ok");
  }

}

module.exports = {
  postCreateUser,
};