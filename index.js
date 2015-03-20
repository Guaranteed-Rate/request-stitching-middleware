"use strict";
var   uuid = require('node-uuid');


module.exports = function(options) {

    options = options || {};
    return function(req, res, next) {
        var reqId = req.get('X-Request-Id');
        if (!reqId) {
            if (options.createIfNotSupplied) {
                reqId = uuid.v4();
                res.set('X-Request-Id', reqId); //not sure if we want this 
            } else {
                res.status(400).send('X-Request-id is missing from the request');
                return;
            }
        }
        req.requestId = reqId;
        next();
    };
};
