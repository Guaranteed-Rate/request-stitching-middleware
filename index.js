"use strict";
var uuid = require('node-uuid');

function stitch(request, response, key, options) {
    var id = request.get(key);
    if (!id) {
        if (options.createIfNotSupplied) {
            id = uuid.v4();
            response.set(key, id);
        } else {
            return undefined;
        }
    }
    return id;    
}

module.exports = function(apiRouteRegExp, options) {
    options = options || {};
    return function(request, response, next) {
        if (request.path.match(apiRouteRegExp)) {
            var errors = [];
            var requestId = stitch(request, response, 'X-Request-Id', options);
            if (!requestId) {
                errors.push('X-Request-Id is missing from the request');
            } else {
                request.requestId = requestId;
            }
            var sessionId = stitch(request, response, 'X-Session-Id', options);
            if (!sessionId) {
                errors.push('X-Session-Id is missing from the request');
            } else {
                request.sessionId = sessionId;
            }
            if (errors.length) {
                response.status(400).json(errors);
                return;
            }
        }
        next();

    };
};
