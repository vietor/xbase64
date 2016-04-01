'use strict';

var assert = require('assert');
var xbase64 = require('../xbase64.js');

var origin = 'I\'m running in xbase64';

describe('NodeJs', function() {
    it('should successed when normal', function(done) {
        assert.equal(origin, xbase64.decodeAsText(xbase64.encode(origin, true)));
        done();
    });

    it('should successed when url', function(done) {
        assert.equal(origin, xbase64.urldecodeAsText(xbase64.urlencode(origin, true)));
        done();
    });

});
