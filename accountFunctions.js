
const db = require('./dbFunctions.js');

module.exports = {
  createAccount: createAccount,
  authorize: authorize,
  deleteAccount: deleteAccount,
  editAccount: editAccount
};

function createAccount(accountInfo){
  return db.createUser(accountInfo);
}

function authorize(){

}

function deleteAccount(){

}

function editAccount(){

}

