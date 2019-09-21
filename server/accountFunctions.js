
const db = require('./dbFunctions.js');

const bcrypt = require('bcrypt');

const saltRounds = 10;

function createAccount(accountInfo) {
  return db.createUser(accountInfo);
}

function authorize(accountInfo) {

  // create the user to check for existence
  var user = {
    email: accountInfo.email,
    username: accountInfo.username
  };
  
  // will use usersExists function to see if it first exists
  if (db.userExists(user)) {
      
    // if it exists, match the username and password
    //   db.User.findOne({
    //     where: {
    //         email: req.body.email
    //            }
    //   }).then(function (user) {
    //    if (!user) {
    //       res.redirect('/');
    //    } else {
    //     bcrypt.compare(req.body.password, user.password, function (err, result) {
    //           if (result == true) {
    //               res.redirect('/home');
    //           } else {
    //           res.send('Incorrect password');
    //           res.redirect('/');
    //           }
    //         });
    //       }
    //     });
  }
 

}

function deleteAccount() {

}

function editAccount() {

}



module.exports = {
  createAccount,
  authorize,
  deleteAccount,
  editAccount
};