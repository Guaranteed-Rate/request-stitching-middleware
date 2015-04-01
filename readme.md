## Express middleware that propagates Request and Session IDs between service calls

The middleware reads X-Request-Id and X-Session-Id from the header and sets it into the "requestId" and "sessionId" property of the Request object.
By default, the request will be rejected with 400 if the header is not present, to ensure that clients are diligent about sending these headers.


Example:
```
app.use(require('request-stitching-middleware')());
```

Front-end applications may override this behavior by passing {generateIfMissing: true}) for the options parameter:
```
app.use(require('request-stitching-middleware')({generateIfMissing: true}));
```
