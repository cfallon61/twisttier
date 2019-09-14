//test/request-time.spec.js
const assert = require('assert');
const requestTime = require('..lib/request-time');
describe('requestTime middleware', function() {
    it('should add a timestamp requestTime prop to req', function() {
        const req = {};
        requestTime(req, null, () => {});
        assert.ok(req.requestTime > 0);
    });
});