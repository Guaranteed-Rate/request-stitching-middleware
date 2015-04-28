var assert = require("assert");
var httpMocks = require('node-mocks-http');
var middlewareConstructor = require('../stitching-middleware.js');


describe('middleware', function(){
    var req, res, nextCalled;
    var API_PREFIX = 'api';
    var REQ_ID_HEADER = 'X-Request-Id';
    var SESSION_ID_HEADER = 'X-Session-Id';
    function nextMock() {
        nextCalled = true;
    }

    function assertHasError(msg) {
        var resp = JSON.parse(res._getData());
        assert(resp.some(function(it) { return it.indexOf(msg) === 0; }));

    }
    function assertRequestIdNotSet() {
        assert.equal(req.requestId, undefined);
        assert.equal(res.get(REQ_ID_HEADER), undefined);
    }
    function assertSessionIdNotSet() {
        assert.equal(req.sessionId, undefined);
        assert.equal(res.get(SESSION_ID_HEADER), undefined);
    }
    function assertNothingDone() {
        
        assertRequestIdNotSet();
        assertSessionIdNotSet();

    }

    function assertReqRejected() {
        assert(!nextCalled);
        assert(res.statusCode == 400);
    }

    beforeEach(function() {
        //request with no headers
        req  = httpMocks.createRequest({
            url: '/' + API_PREFIX + '/blah'
        });
        res = httpMocks.createResponse();
        nextCalled = false;
    });


    it('should generate IDs only for when configured', function(){
        var middleware = middlewareConstructor({generateIfMissing: true});
    

        middleware(req, res, nextMock);
        
        assert(nextCalled);
        assert(res.statusCode == 200);
        assert(req.requestId);
        assert(req.sessionId);
        assert.equal(req.requestId, res.get(REQ_ID_HEADER) );
        assert.equal(req.sessionId, res.get(SESSION_ID_HEADER) );
        
    });

    it('should reject the request if session and request are missing, BY DEFAULT', function(){
        var middleware = middlewareConstructor();

        middleware(req, res, nextMock);
        
        assertReqRejected();
        assertNothingDone();

        
    });
    it('should reject the request if session and request are missing, and configured explictly', function(){
        var middleware = middlewareConstructor({generateIfMissing: false});
    

        middleware(req, res, nextMock);
        assertReqRejected();
        assertNothingDone();        
        assertHasError('X-Request-Id is missing from the request');
        assertHasError('X-Session-Id is missing from the request');
        
    });


    it('should reject the request if requestid is missing', function(){
        var middleware = middlewareConstructor();

        req._setHeadersVariable(SESSION_ID_HEADER, 'foo');

        middleware(req, res, nextMock);
        
        assertReqRejected();
        assertRequestIdNotSet();

        assertHasError('X-Request-Id is missing from the request');
        
    });

    it('should fail if sessionId is missing', function(){
        var middleware = middlewareConstructor();
    
        req._setHeadersVariable(REQ_ID_HEADER, 'foo');

        middleware(req, res, nextMock);
        
        assertReqRejected();
        assertSessionIdNotSet();

        assertHasError('X-Session-Id is missing from the request');
        
    });

    it('should should set sessionId and requestId', function(){
        var middleware = middlewareConstructor();
    
        req._setHeadersVariable(REQ_ID_HEADER, 'foo');
        req._setHeadersVariable(SESSION_ID_HEADER, 'bar');        
        middleware(req, res, nextMock);

        assert(nextCalled);
        assert(res.statusCode == 200);
        assert.equal(req.requestId, 'foo');
        assert.equal(req.sessionId, 'bar');
        
    });



});



