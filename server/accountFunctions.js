
const db = require('./dbFunctions.js');



function createAccount(accountInfo) {
  return db.createUser(accountInfo);
}

function authorize() {

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