var assert = require("assert");
var httpMocks = require('node-mocks-http');
var middlewareConstructor = require('../index.js');


describe('middleware', function(){
    var req, res, nextCalled;
    var API_PREFIX = 'api'
    function nextMock() {
        nextCalled = true;
    }

    function assertNothingDone(req, res) {
        assert.equal(req.requestId, undefined);
        assert.equal(req.sessionId, undefined);
        assert.equal(res.get("X-Request-Id"), undefined);
        assert.equal(res.get("X-Session-Id"), undefined);
    }

    beforeEach(function() {
        req  = httpMocks.createRequest({
            url: '/' + API_PREFIX + '/blah'
        });
        res = httpMocks.createResponse();
        nextCalled = false;
    });

    it('should not act for unmatching routes', function(){
        var middleware = middlewareConstructor("^/NOT-AN-API");
        
        middleware(req, res, nextMock);

        assert(nextCalled);
        assert(res.statusCode == 200);
        
        assertNothingDone(req, res);
        

    });


    it('should set request id only for matching routes when configured', function(){
        var middleware = middlewareConstructor("^/" + API_PREFIX, {createIfNotSupplied: true});
    

        middleware(req, res, nextMock);
        
        assert(nextCalled);
        assert(res.statusCode == 200);
        assert(req.requestId);
        assert(req.sessionId);
        assert.equal(req.requestId, res.get('X-Request-Id') );
        assert.equal(req.sessionId, res.get('X-Session-Id') );
        
    });

    it('should fail the request if session and request are missing, BY DEFAULT', function(){
        var middleware = middlewareConstructor("^/" + API_PREFIX);
    

        middleware(req, res, nextMock);
        
        assert(!nextCalled);
        assert(res.statusCode == 400);
        assertNothingDone(req, res);
        assert(JSON.parse(res._getData()).length, 2);
        
    });
    it('should fail the request if session and request are missing, and configured explictly', function(){
        var middleware = middlewareConstructor("^/" + API_PREFIX,  {createIfNotSupplied: false});
    

        middleware(req, res, nextMock);
        
        assert(!nextCalled);
        assert(res.statusCode == 400);
        assertNothingDone(req, res);
        
    });
    
    it('should fail if requestid is missing', function(){
        var middleware = middlewareConstructor("^/" + API_PREFIX);
    
        req  = httpMocks.createRequest({
            url: '/' + API_PREFIX + '/blah'
        });
        middleware(req, res, nextMock);
        
        assert(!nextCalled);
        assert(res.statusCode == 400);
        assertNothingDone(req, res);
        
    });



});



