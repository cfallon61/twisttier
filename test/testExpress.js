const assert = require('assert');
const httpMocks = require('node-mocks-http');
const router = require('../server/middleware.js');
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
      await router.postCreateUser(req, mockres);
      const actualRes = mockres._getData();
      
      assert.notDeepStrictEqual(actualRes, false);
      return true;
    });
  });

  describe("#userExists() true", async () => {
    it ("should return a list of errors", async() => {
      user = {
        email: "test@test.com",
        username: "test"
      };

      var res = await db.userExists(user);

      assert.notDeepStrictEqual(res, false);
    });
  });

  describe("#userExists() false", async () => {
    it("should return false", async () => {
      user = {
        email: "test@test656565.com",
        username: "test656565"
      };

      var res = await db.userExists(user);

      assert.deepStrictEqual(res, false);
    });
  });
});