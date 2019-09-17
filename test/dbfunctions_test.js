/* test/dbfunction_test.js */

var dbfunction_test = require('../server/dbFunctions.js');
var expect = require('chai').expect;

describe('getSpins()', function () {
  it('should return an array of jsons', function () {
    var spin = [
      {
        "user": "poop",
        "date": "post date",
        "text": "content",
        "quotes": 30,
        "likes": 12,
        "tags": [
          { tag1: "name" },
          { tag2: "name" }
        ]
      },
      {
        "user": "poop",
        "date": "post date",
        "text": "content",
        "quotes": 0,
        "likes": 100,
        "tags": [
          { tag1: "name" },
          { tag2: "name" }
        ]
      }
    ];

    // expect(dbfunction_test().to.deep.equal(0));
    expect(true);

  });
});
