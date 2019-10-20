const assert = require('assert');
const httpMocks = require('node-mocks-http');
const router = require('../server/accountFunctions');
const db = require('../server/dbFunctions');



describe("middleware / routing function tests", () => {
  describe("#createUser !exist", async () => { 
    it("should return a redirect to the upload profile image page", async () => {
        const req = httpMocks.createRequest(
        {
          method: "POST",
          url: '/create_user',
          body: {
            username: 'bringMeDeath',
            email: 'welcometohell@gmail.com',
            name: "Kurt",
            password: "password",
            bio: 'why am i the only one actually working?',
          }
        });

      const mockres = httpMocks.createResponse();
      // post to router
      await router.postCreateUser(req, mockres, () => {});
      const actualRes = mockres._getData();

      if (actualRes === 'user exists'){
        assert.notDeepStrictEqual(actualRes, 'user exists');
      }
      else{
        assert.notDeepStrictEqual(actualRes, false);
      }
      return true;
    });
  });

  describe('#authorize', () => {
 
    it('@test authorize good pass', async () => {
      const req = httpMocks.createRequest(
        {
          method: 'POST',
          url: '/login',
          body: {
            username: 'bringMeDeath',
            password: 'password',
          }
        });

        const mockres = httpMocks.createResponse();

        await router.authorize(req, mockres, () => {});

        const actual = mockres._getHeaders();
        assert.notDeepStrictEqual(actual, undefined);
    });

    it('@test authorize bad pass', async () => {
      const req = httpMocks.createRequest(
        {
          method: 'POST',
          url: '/login',
          body: {
            username: 'bringMeDeath',
            password: 'bad pass',
          }
        });

      const mockres = httpMocks.createResponse();

      await router.authorize(req, mockres, () => {});

      const actual = mockres._getHeaders();
      const expected = { error: 'Incorrect Password' };

      assert.deepStrictEqual(actual, expected);

    });

    it('@test authorize no user', async () => {
      const req = httpMocks.createRequest(
        {
          method: 'POST',
          url: '/login',
          body: {
            username: 'gfhjksdfghjhuif',
            password: 'password',
          }
        });

      const mockres = httpMocks.createResponse();

      await router.authorize(req, mockres, () => {});

      const actual = mockres._getHeaders();
      const expected = {error : 'Username invalid'};
        // console.log("actual: ", actual);
        // console.log("expected: ", expected);
      assert.deepStrictEqual(actual, expected);
    });
  });

// TODO test for following multiple people with a different account
//     create an account for each test, then delete the account after the test is run
  describe('#getTimeline', () => {
    it('@getTimeline bringMeDeath ', async () => {
      const req = httpMocks.createRequest(
        {
          method: "POST",
          url: '/api/timeline/doeJohn',
          params: {
            username: 'doeJohn',
          }
      });

      const mockRes = httpMocks.createResponse();
      await router.getTimeline(req, mockRes, () => {});

      const actualRes = mockRes._getJSONData();

      if (mockRes.getHeader('error') != undefined){
        assert.fail();
      }

      // console.log(actualRes);

    });
  });

  describe("#updateProfileInfo", async () => { 
    it("id exists, returns user updated", async () => {
        const req = httpMocks.createRequest(
        {
          method: "POST",
          url: '/updateProfileInfo',
          body: {
            id: 1,
            password: 'passwordsr4losers',
            bio: 'i hate my life', 
            name: 'test', 
            interests: [],
            accessibility_features: {},
            profile_pic: []
          }
        });

      const mockres = httpMocks.createResponse();
      
      // post to router
      await router.updateProfileInfo(req, mockres, () => {});
      const actualRes = mockres.getHeader('message');
        // console.log(actualRes);
      assert.equal(actualRes, "user updated");
    });
    it("id does not exist, should return user not found", async () => {
      const req = httpMocks.createRequest(
      {
        method: "POST",
        url: '/updateProfileInfo',
        body: {
          id: -1,
          password: 'i do not exist',
          bio: 'doesnotexist', 
          name: 'existingispain', 
          interests: [],
          accessibility_features: {},
          profile_pic: []
        }
      });
  
      const mockres = httpMocks.createResponse();
    
      // post to router
      await router.updateProfileInfo(req, mockres, () => {});
      // console.log(mockres);
      const actualRes = mockres.getHeader("error");
      // console.log("actual:", actualRes);
      assert.equal(actualRes, "user not found");
    });
    // updateprofileInfo should return next() if fail not false, 
    // need a test for that
    it("id exists with password not given, should return user found", async () => {
      const req = httpMocks.createRequest(
      {
        method: "POST",
        url: '/updateProfileInfo',
        body: {
          id: 6,
          bio: 'yellow', 
          name: 'Harvey', 
          interests: [],
          accessibility_features: {},
          profile_pic: []
        }
      });
  
      const mockres = httpMocks.createResponse();
    
      // post to router
      await router.updateProfileInfo(req, mockres, () => {});
      // console.log(mockres);
      const actualRes = mockres.getHeader("message");
      // console.log("actual:", actualRes);
      assert.equal(actualRes, "user updated");
    });
  });

  describe('#getPosts', async () => {
    it('@test get posts doeJohn', async () => {
        const req = httpMocks.createRequest(
          {
            method: "POST",
            url: '/api/timeline/post',
            params: {
              username: 'doeJohn',
            }
        });
  
        const mockRes = httpMocks.createResponse();
        await router.getPosts(req, mockRes, () => {});
  
        const actualRes = mockRes._getJSONData();
  
        if (mockRes.getHeader('error') != undefined){
          assert.fail();
        }
    });
  });


  describe("#get info", async () => { 
    it("@username exists: ", async () => {
        const req = httpMocks.createRequest(
        {
          method: "POST",
          url: '/api/users/test',
          params: {
            username: "test",
          }
        });

      const mockres = httpMocks.createResponse();
      
      // post to router
      await router.getUserInfo(req, mockres, () => {});
      const actualRes = mockres.getHeader('error');
      if (actualRes != undefined){
        console.log(mockres);
        assert.notDeepStrictEqual(actualRes, undefined);
      }
    });
    
  });

  describe("#create spin", async () => {

    it("@quote == false: ", async () => {
      const req = httpMocks.createRequest(
        {
          method: "POST",
          url: '/api/add_spin',
          body: {
            spinBody: "yo screw you man",
            tags: ['wtf', 'kill me'],
            is_quote: false,
            quote_origin: undefined
          }
        });

      const mockres = httpMocks.createResponse();

      // post to router
      await router.createSpin(req, mockres, () => {});
      const actualRes = mockres.getHeader('error');

      console.log(mockres);
      assert.deepStrictEqual(actualRes, undefined, 'expected undefined but got' + String(actualRes));
    });
    it("@quote == true, origin undefined: ", async () => {
      const req = httpMocks.createRequest(
        {
          method: "POST",
          url: '/api/add_spin',
          body: {
            spinBody: "yo screw you man",
            tags: ['wtf', 'kill me'],
            is_quote: true,
            quote_origin: undefined
          }
        });

      const mockres = httpMocks.createResponse();

      // post to router
      await router.createSpin(req, mockres, () => { });
      const actualRes = mockres.getHeader('error');
      console.log(mockres);

      assert.notDeepStrictEqual(actualRes, undefined, 'expected to be defined but response was undefined.');

    });

    it("@quote == true, origin undefined: ", async () => {
      const req = httpMocks.createRequest(
        {
          method: "POST",
          url: '/api/add_spin',
          body: {
            spinBody: "yo screw you man",
            tags: ['wtf', 'kill me'],
            is_quote: true,
            quote_origin: "bringMeDeath"
          }
        });

      const mockres = httpMocks.createResponse();

      // post to router
      await router.createSpin(req, mockres, () => { });
      const actualRes = mockres.getHeader('error');
      console.log(mockres);

      assert.deepStrictEqual(actualRes, undefined, 'expected undefined but was ' + String(actualRes));

    });

  });
});