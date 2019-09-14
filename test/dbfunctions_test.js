/* test/dbfunction_test.js */

var dbfunction_test = require('../dbFunctions.js');
var expect = require('chai').expect;

describe('dbfunction_test.getSpins()', function() {
    it('should return an array of jsons', function() { 
        var spin = [
            {
              "user": "poop",
              "date": "post date",
              "text": "content",
              "quotes": quote_count,
              "likes": like_count,
              "tags": [
                {tag1: "name"},
                {tag2: "name"}
              ]
            },
            {
              "user": "poop",
              "date": "post date",
              "text": "content",
              "quotes": quote_count,
              "likes": like_count,
              "tags": [
                {tag1: "name"},
                {tag2: "name"}
              ]
            }
          ]; 
          
        expect(dbfunction_test().to.deep.equal(0));
        
    });
});
