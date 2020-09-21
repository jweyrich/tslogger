import { TsLogger } from './logger';
import { LogFormat, LogLevel } from './interface';

function sample_logger(logger: TsLogger) {
    logger.trace("message using the trace level");
    logger.debug("message using the debug level");
    const someContext = {
        strProperty: "value",
        boolProperty: false,
        numberProperty: 3.1415,
        nullProperty: null as string,
        requestId: "4f732a3d-d136-48d7-ae32-f5895a739413",
    };
    logger.info("message using the info level", someContext);
    logger.warn("message using the warn level");
    logger.error("message using the error level", null, new Error("recoverable error"));
    logger.fatal("message using the fatal level", null, new Error("fatal error"));
    try {
        throw new RangeError('index out of bounds');
    } catch (e) {
        logger.fatal("caught a fatal exception", null, e);
    }
}

function sample() {
    if (process.env.LOG_LEVEL || process.env.LOG_FORMAT) {
        // Sample using environment variables: LOG_LEVEL=INFO LOG_FORMAT=json node dist/log/logger.js
        sample_logger(new TsLogger());
    } else {
        sample_logger(new TsLogger({ format: LogFormat.text, minLevel: LogLevel.TRACE }));
        console.log('');
        sample_logger(new TsLogger({ format: LogFormat.json, minLevel: LogLevel.TRACE }));
    }
}

sample();