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
  describe.skip("#db.userExists()", async () => {
    it("@test email does exist", async () => {
      console.log("@test email does exist")
      user = {
        email: "test@test.com",
      };

      var res = await db.userExists(user);
      console.log(res);

      assert.notDeepStrictEqual(res, false);
    });

    it("@test email not exist", async () => {
      console.log("@test email not exist")
      user = {
        email: "test@test656565.com",
      };

      var res = await db.userExists(user);

      assert.deepStrictEqual(res, false);
    });

    it("@test username does exist", async () => {
      console.log("@test username does exist");
      user = {
        username: "test",
      };

      var res = await db.userExists(user);
      // console.log(res);

      assert.notDeepStrictEqual(res, false);
    });

    it("@test username not exist", async () => {
      console.log("@test username not exist");
      user = {
        username: "i_wish_to_die",
      };

      var res = await db.userExists(user);

      assert.deepStrictEqual(res, false);
    });
  });

 
  describe.skip("#db.createUser()", () => {

    it.skip ('@test not exist: should return true', async () => {
      console.log('@test not exist: should return true');
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

    
    it.skip('@test email exists: should fail', async () => {
      console.log('@test email exists: should fail');
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

  describe.skip('#updateUserInfo',  () => {
    it('@test change user info with password: should return user id', async () => {
      user = {
        // id: 1,
        username: 'test',
        password: 'passwordsr4losers',
        bio: 'i hate my life', 
        name: 'test', 
        interests: [],
        accessibility_features: {},
        profile_pic: []
      };

      var res = await db.updateUser(user);
      // assert
      assert.deepStrictEqual(res, user.username);
    });
    it('@test change user info not password: should return username', async () => {
      user = {
        username: 'doeJohn',
        bio: 'Harvey hates my life', 
        name: 'Harvey', 
        interests: [],
        accessibility_features: {},
        profile_pic: []
      };

      var res = await db.updateUser(user);
      // assert
      assert.deepStrictEqual(res, user.username);
    });

  });

  
  describe.skip('#deleteUser',  () => {
    
    it('user exists: should return username', async () => {
      username = "k";
     
      var res = await db.deleteUser(username);
      
      // assert
      assert.notDeepStrictEqual(res, false);

      var res = await db.deleteUser(user);
    });
  });

  describe('#followTopicUserPair',  () => {
    
    it('follows user: should return username', async () => {
      
      username = 'k';
      tofollow = 'test';
      tags = [];
      
      var res = await db.followTopicUserPair(username, tofollow, tags);
      
      // assert
      assert.deepStrictEqual(res, false);

      // var res = await db.deleteUser(user);
    });
  });

});
