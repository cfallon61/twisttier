/* test/dbfunction_test.js */

var db = require('../server/dbFunctions.js');
var accFunc = require('../server/accountFunctions.js');
var expect = require('chai').expect;
const assert = require('assert');
const bcrypt = require('bcrypt');

describe('database functions test', function() {
  describe('#dp.addSpin()', async () => {
    it('checks if spin gets added successfully', async () => {

      var username = "f";

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

      var res = await db.addSpin(username, spin);

      assert.notEqual(res, false);
    });

    it('No tags given to a post. Should still pass', async () => {

      var username = "f";

      spin = {
        content: 'I should fail',
        tags: [],
        edited: false,
        likes: 0,
        quotes: 0,
        is_quote: false,
        quote_origin: {},
        like_list: []
      };

      var res = await db.addSpin(username, spin);

      assert.notEqual(res, false);
    });

    it('Associated username or email does not exist. Should fail', async () => {

      var username = "notExistUsername";

      spin = {
        content: 'I should fail',
        tags: ['fail', 'or pass'],
        edited: false,
        likes: 0,
        quotes: 0,
        is_quote: false,
        quote_origin: {},
        like_list: []
      };

      var res = await db.addSpin(username, spin);

      assert.deepStrictEqual(res, false);
    });


    it('Wrong parameters entered. Should fail', async () => {

      user = {
        username : "f",
        email: "myEmail",
        bs : "bsss"
      }

      spin = {
        content: 'I should fail',
        tags: ['fail', 'or pass'],
        edited: false,
        likes: 0,
        quotes: 0,
        is_quote: false,
        quote_origin: {},
        like_list: []
      };

      var res = await db.addSpin(user, spin);

      assert.deepStrictEqual(res, false);
    });

    
  });
  
  
  describe("#db.userExists()", async () => {
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

 
  describe("#db.createUser()", () => {

    it ('@test not exist: should return true', async () => {
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

    
    it('@test email exists: should fail', async () => {
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

  describe('#updateUserInfo',  () => {
    it('@test change user info with password: should return user username, last_login, and profile_pic', async () => {
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
      assert.notDeepStrictEqual(res, false);
    });
    it('@test change user info not password: should return username, last_login, and profile_pic', async () => {
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
      assert.notDeepStrictEqual(res, false);
    });

  });

  
  describe.skip('#deleteUser',  () => {
    
    it('user exists: should return username', async () => {
      user = {
        username: 'testingUser',
        password: 'passwordsr4losers',
        email: 'kaizer@von.heimer',
        bio: 'i hate my life', 
        name: 'testing, delete if bad'
      };
     
      var res = await db.deleteUser(user.username);
      
      // assert
      assert.notDeepStrictEqual(res, false);

      var res = await db.deleteUser(user);
    });
  });

  describe('#followTopicUserPair',  () => {
    
    it('@test add user topic pair: should return username', async () => {
      user = {
        username: 'testingUser',
        password: 'passwordsr4losers',
        email: 'kaizer@von.heimer',
        bio: 'i hate my life', 
        name: 'testing, delete if bad'
      };
      
      //var res = await db.createUser(user);
      
      tofollow = {
        username: 'f',
        tags: ['chungus', 'hotdogs']
      };

      var res = await db.followTopicUserPair(user.username, tofollow.username, tofollow.tags);
      // assert
      assert.deepStrictEqual(res, user.username);
    });

    it('@test add user topic pair: should return username', async () => {
      user = {
        username: 'testingUser',
        password: 'passwordsr4losers',
        email: 'kaizer@von.heimer',
        bio: 'i hate my life', 
        name: 'testing, delete if bad'
      };

      tofollow = {
        username: 'seriously',
        tags: ['chris', 'nazim']
      };

      var res = await db.followTopicUserPair(user.username, tofollow.username, tofollow.tags);
      // assert
      assert.deepStrictEqual(res, user.username);
    });

    it('@adding follow topic for an existing username in database, needed for unfollow test', async () => {
      
      username = "f";

      tofollow = "seriously";

      tags = ["random1", "random2"];
  
      var res = await db.followTopicUserPair(username, tofollow, tags);
      
      assert.deepStrictEqual(res, username);
    });

    it('@following username does not exist - should return false', async () => {
      
      username = "iDoNotExist";

      tofollow = "seriously";

      tags = ["random1", "random2"];
  
      var res = await db.followTopicUserPair(username, tofollow, tags);
      
      assert.deepStrictEqual(res, false);
    });

    it('@toFollow username does not exist - should return false', async () => {
      
      username = "f";

      tofollow = "iDoNotExist";

      tags = ["random1", "random2"];
  
      var res = await db.followTopicUserPair(username, tofollow, tags);
      
      assert.deepStrictEqual(res, false);
    });
  });

  describe('#unfollowTopicUserPair',  () => {
    
    it('@both users and tags exist, should return true', async () => {

      unfollowingUser = "f";
      unfollowedUser = "seriously";
      tags = ['random1'];

      var res = await db.unfollowTopicUserPair(unfollowingUser, unfollowedUser, tags);

      // assert
      assert.deepStrictEqual(res, true);
    });

    it('@testing where user is deleted completely, should return true', async () => {

      unfollowingUser = "f";
      unfollowedUser = "seriously";
      tags = ['random2'];

      var res = await db.unfollowTopicUserPair(unfollowingUser, unfollowedUser, tags);

      // assert
      assert.deepStrictEqual(res, true);
    });

    it('@unfollowing user does not exist, should return false', async () => {

      unfollowingUser = "iDoNotExist";
      unfollowedUser = "seriously";
      tags = ['random1', 'random2'];

      var res = await db.unfollowTopicUserPair(unfollowingUser, unfollowedUser, tags);

      // assert
      assert.deepStrictEqual(res, false);
    });

    it('@unfollowed user does not exist, should return false', async () => {

      unfollowingUser = "f";
      unfollowedUser = "iDoNotExist";
      tags = ['random1'];

      var res = await db.unfollowTopicUserPair(unfollowingUser, unfollowedUser, tags);

      // assert
      assert.deepStrictEqual(res, false);
    });

  });

});
