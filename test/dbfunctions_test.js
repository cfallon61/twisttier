/* test/dbfunction_test.js */

var db = require('../server/dbFunctions.js');
var accFunc = require('../server/accountFunctions.js');
var expect = require('chai').expect;
const assert = require('assert');
const bcrypt = require('bcrypt');

describe('database functions test', function() {
  describe('#dp.addSpin()', async () => {
    it('checks if spin gets added successfully', async () => {

      user = {
        email: "jdoe@purdue.edu",
        username: "doeJohn"
      };

      spin = {
        content: 'god is upon us',
        tags: ['God is Chris', 'Chris is God'],
        edited: false,
        likes: 0,
        quotes: 0,
        is_quote: false,
        quote_origin: {},
        like_list: []
      };

      var res = await db.addSpin(user, spin);
      var spin_id = await db.deleteSpin(user, res.id);
      assert.equal(res.id, spin_id.id);
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
    it('@test change user info with password: should return user id', async () => {
      user = {
        id: 1,
        password: 'passwordsr4losers',
        bio: 'i hate my life', 
        name: 'test', 
        interests: [],
        accessibility_features: {},
        profile_pic: []
      };

      var res = await db.updateUser(user);
      // assert
      assert.deepStrictEqual(res, 1);
    });
    it('@test change user info not password: should return user id', async () => {
      user = {
        id: 6,
        bio: 'Harvey hates my life', 
        name: 'Harvey', 
        interests: [],
        accessibility_features: {},
        profile_pic: []
      };

      var res = await db.updateUser(user);
      // assert
      assert.deepStrictEqual(res, 6);
    });

  });

  
  describe('#deleteUser',  () => {
    
    it.skip('user exists: should return true', async () => {
      user = {
        username: "bringMeDeath",
      };

      var res = await db.deleteUser(user);

      // assert
      assert.deepStrictEqual(res, true);
    });
  });

});
