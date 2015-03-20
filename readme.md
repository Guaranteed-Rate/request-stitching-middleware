## Express middleware that propagates RequestId between service calls

The middleware reads X-Request-Id from the header and sets it into the "requestId" property of the Request object.
By default, the request will be rejected with 400 if the header is not present, to ensure that clients are diligent about sending this header.


Example:
```
app.use(require('stiching-express-request-id')());
```

Front-end applications may override this behavior by passing {createIfNotSupplied: true}) for the options parameter:
```
app.use(require('stiching-express-request-id')({createIfNotSupplied: true}));
```
