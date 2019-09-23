/* test/dbfunction_test.js */

var db = require('../server/dbFunctions.js');
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

  describe("#db.userExists()", async () => {
    it("should return user data for this user", async () => {
      user = {
        email: "test@test.com",
        username: "test"
      };

      var res = await db.userExists(user);

      assert.notDeepStrictEqual(res, false);
    });

    it("should return false", async () => {
      user = {
        email: "test@test656565.com",
        username: "test656565"
      };

      var res = await db.userExists(user);

      assert.deepStrictEqual(res, false);
    });
  });

  describe("#db.createUser()", () => {
    it ('@test not exist: should return true', async () => {
      var user = {
        username: 'bringMeDeath',
        email: 'welcometohell@gmail.com',
        name: "Kurt",
        password: "password",
        bio: 'why am i the only one actually working?',
      }

      var res = await db.createUser(user);

      assert.deepStrictEqual(res, true); 
  });

  it ('@test user exists: should fail', async () => {
    var user = {
      username: 'test',
      email: 'test@test.com',
      name: "whatever",
      password: "password",
      bio: 'why am i the only one actually working?',
    }

    var res = await db.createUser(user);

    assert.notDeepStrictEqual(res, true);
  });  
  });

  describe('#db.deleteUser()', () => {
    it('@test delete user exist: should return true', async () => {
      var username = 'bringMeDeath';

      var res = await db.deleteUser(username);

      assert.deepStrictEqual(res, true);
    });

    it ('@test delete user !exist: should fail', async () => {
      var username = "fsdhjklasdf9p834y";
      var res = await db.deleteUser(username);

      assert.notDeepStrictEqual(res, true);
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

//   describe('passHash', function() {
//     it('should return true on both tests', function() {
//       // bcrypt.compare('Password123', hash, function(err, res) {
//         // expect(res).to.equal(true);
//         // if(res) {
//         //  // Passwords match
//         // } else {
//         //  // Passwords don't match
//         // } 
//       });
//     });
//   });
});
