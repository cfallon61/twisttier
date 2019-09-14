//test/request-time.spec.js
const assert = require('assert');

describe('Test Assert Fail', function() {
    it('should fail immediately', function() {
        assert.fail("Testing if the build will fail and not deploy in pipeline");
    });
});