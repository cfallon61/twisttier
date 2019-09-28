const assert = require('assert');
const httpMocks = require('node-mocks-http');
const router = require('../server/accountFunctions');
const db = require('../server/dbFunctions');



describe("middleware / routing function tests", () => {
  describe.skip("#createUser !exist", async () => { 
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
        // TODO assert 
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

  // test for user info
  describe("#userInfo", async () => { 
    it("should return username with specific username", async () => {
        const req = httpMocks.createRequest(
        {
          method: "POST",
          url: '/info',
          body: {
            username: 'test',
            email: 'test@test.com',
          }
        });

      const mockres = httpMocks.createResponse();
      
      // post to router
      await router.viewInfo(req, mockres);
      // console.log(mockres);
      const actualRes = mockres._getData();
      console.log(actualRes);
      assert.notDeepStrictEqual(actualRes, false);
      return true;
    });

    // test for user that does not exist
    it("Invalid user: should return false", async () => {
      const req = httpMocks.createRequest(
      {
        method: "POST",
        url: '/info',
        body: {
          username: 'tesasdsadts',
          email: 'tesdsadast@tesst.com',
        }
      });

    const mockres = httpMocks.createResponse();
    
    // post to router
    await router.viewInfo(req, mockres);
    // console.log(mockres);
    const actualRes = mockres._getData();
    console.log(actualRes);
    assert.DeepStrictEqual(actualRes, false);
    return true;
  });

  it("should return username of all username", async () => {
    const req = httpMocks.createRequest(
    {
      method: "POST",
      url: '/info',
      body: {
        username: 'all',
        email: 'tesaddasst@tesst.com',
      }
    });

  const mockres = httpMocks.createResponse();
  
  // post to router
  await router.viewInfo(req, mockres);
  // console.log(mockres);
  const actualRes = mockres._getData();
  console.log(actualRes);
  assert.notDeepStrictEqual(actualRes, false);
  return true;
});


  });
});