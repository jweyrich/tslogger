### TsLogger (NOT READY TO USE YET!)

A simple TypeScript library to handle logging.

#### How to install

```
npm install https://github.com/jweyrich/tslogger#master
```

#### How to use

```
const logger = new TsLogger({ format: LogFormat.text, minLevel: LogLevel.TRACE });
logger.trace("message using the trace level");
logger.debug("message using the debug level");
const someContext = {
    strProperty: "value",
    boolProperty: false,
    numberProperty: 3.1415,
    nullProperty: null,
    requestId: "4f732a3d-d136-48d7-ae32-f5895a739413",
};
logger.info("message using the info level", someContext);
logger.warn("message using the warn level");
logger.error("message using the error level", null, new Error("recoverable error"));
logger.fatal("message using the fatal level", null, new Error("fatal error"));
try {
    throw new RangeError('index out of bounds');
} catch (e) {
    logger.fatal("caught a fatal exception", e);
}
```