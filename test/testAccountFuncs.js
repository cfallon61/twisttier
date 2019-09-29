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
          url: '/timeline',
          body: {
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
});