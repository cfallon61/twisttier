/* test/dbfunction_test.js */

var dbfunction_test = require('../server/dbFunctions.js');
var expect = require('chai').expect;
const assert = require('assert');
const bcrypt = require('bcrypt');

describe('database functions test', function() {
  describe('getSpins', function () {
    it('should return an array of jsons', function () {
      var spin = [
        {
          "user": "poop",
          "date": "post date",
          "text": "content",
          "quotes": 30,
          "likes": 12,
          "tags": [
            { tag1: "name" },
            { tag2: "name" }
          ]
        },
        {
          "user": "poop",
          "date": "post date",
          "text": "content",
          "quotes": 0,
          "likes": 100,
          "tags": [
            { tag1: "name" },
            { tag2: "name" }
          ]
        }
      ];
      expect(spin);
  
    });
  });

  describe('getCurrentTime', function () {
    it('should return the exact date and time', function () {
      var date = dbfunction_test.getCurrentTime()
      expect(date);
    });
  });

  // describe('createUser', function() {
  //   it('should return true', async function() {
  //     var realUser;
  //     realUser.email = "jdoe@purdue.edu";
  //     realUser.username = "doeJohn";
  //     let user = await dbfunction_test.createUser(realUser);
  //     expect(user).to.equal(true);
  //   });
  //   it('should return false', async function() {
  //     var fakeUser;
  //     fakeUser.email = "uhoh@stinky.com";
  //     fakeUser.username = "poopy";
  //     let user = await dbfunction_test.createUser(fakeUser);
  //     expect(user).to.equal(false);
  //   });
  // });

  describe('passHash', function() {
    it('should return true on both tests', function() {
      bcrypt.compare('Password123', hash, function(err, res) {
        expect(res).to.equal(true);
        // if(res) {
        //  // Passwords match
        // } else {
        //  // Passwords don't match
        // } 
      });
    });
  });
});
