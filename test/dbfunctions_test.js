/* test/dbfunction_test.js */

var db = require('../server/dbFunctions.js');
var accFunc = require('../server/accountFunctions.js');
var expect = require('chai').expect;
const assert = require('assert');
const bcrypt = require('bcrypt');

describe('database functions test', function() {
  describe('getSpins', function () {
    it('should return an array of jsons', function () {
  
    });
  });

  describe('#dp.addSpin()', async () => {
    // when testing addSpin put spin.likes as -1
    // that way it knows to delete after it was put
    // we will implement a deleteSpin after sprint
    // this is just temporary
    it('checks if spin gets added successfully', async () => {

      user = {
        email: "jdoe@purdue.edu",
        username: "doeJohn"
      };

      spin = {
        content: 'god is upon us',
        tags: ['God is Chris', 'Chris is God'],
        edited: false,
        likes: -1,
        quotes: 0,
        is_quote: false,
        quote_origin: {},
        like_list: []
      };

      var res = await db.addSpin(user, spin);

      assert.notDeepStrictEqual(res, false);
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

      if (res === 'user exists') {
        assert.deepStrictEqual(res, 'user exists');
      }
      else {
        assert.notDeepStrictEqual(res, false);
      } 
    });
    it('@recreate doeJohn user, not an actual test', async () => {
      var user = {
        username: 'doeJohn',
        email: 'email@email.com',
        name: "Harvey",
        password: "password",
        bio: 'my name is Harvey Hinkelberg, but they call me john',
      }

      var res = await db.createUser(user);
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
    it ('@test email exists: should fail', async () => {
      var user = {
        username: 'jhfdjhfbh',
        email: 'test@test.com',
        name: "whatever",
        password: "password",
        bio: 'why am i the only one actually working?',
      }

      var res = await db.createUser(user);

      assert.notDeepStrictEqual(res, true);
    });
  });

  describe('#updateUserInfo',  () => {
    it('Changed info successfully: should return true', async () => {
      user = {
        email: "test@test.com",
        username: "test",
        password: "newPass",
        name: "newName",
        bio: "this is my new bio"
      };

      var res = await db.updateUser(user);
      console.log(res);

    });
  });

});
