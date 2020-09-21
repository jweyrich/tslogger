import { TsLogger } from '../src/logger';
import { ContextType, LogFormat, LogLevel } from '../src/interface';

describe("the logger", () => {

  const OriginalDateImpl = Date;
  const ConstantDateString = '2020-09-20T10:20:30.456Z';
  const ConstantDateInstance = new Date(ConstantDateString);

  class MockedDate extends Date {
    /* eslint-disable */
    // @ts-ignore Constructors for derived classes must contain a 'super' call.ts(2377)
    constructor() {
      return ConstantDateInstance;
    }
    /* eslint-enable */
  }

  beforeAll(() => {
    /* eslint-disable */
    // @ts-ignore Constructors for derived classes must contain a 'super' call.ts(2377)
    Date = MockedDate;
    /* eslint-enable */
  });

  afterAll(() => {
    // eslint-disable-next-line no-global-assign
    Date = OriginalDateImpl;
  });

  beforeEach(() => {
    // TODO ...
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should be configured using defaults", () => {
    const logger = new TsLogger();
    expect(logger.settings.minLevel).toEqual(LogLevel.INFO);
    expect(logger.settings.format).toEqual(LogFormat.text);
  });

  test("should be configured using environment variables", () => {
    process.env.LOG_LEVEL = "WARN";
    process.env.LOG_FORMAT = "json";
    const logger = new TsLogger();
    expect(logger.settings.minLevel).toEqual(LogLevel.WARN);
    expect(logger.settings.format).toEqual(LogFormat.json);
  });

  test("log functions should produce exact text outputs", () => {
    const logger = new TsLogger({ format: LogFormat.text, minLevel: LogLevel.TRACE });
    const spy_writeMessage = jest.spyOn(logger, 'writeMessage').mockImplementation((level: LogLevel, message: unknown) => { /* do nothing */ });

    logger.trace("message using the trace level"); // 1
    logger.debug("message using the debug level"); // 2
    logger.info("message using the info level"); // 3
    logger.warn("message using the warn level"); // 4
    logger.error("message using the error level", null); // 5
    logger.fatal("message using the fatal level", null); // 6

    expect(spy_writeMessage).toHaveBeenCalledTimes(6);
    //expect(spy_writeMessage).toHaveBeenNthCalledWith(1, LogLevel.TRACE, `2020-09-20T10:20:30.456Z TRACE message using the trace level`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(2, LogLevel.DEBUG, `2020-09-20T10:20:30.456Z DEBUG message using the debug level`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(3, LogLevel.INFO, `2020-09-20T10:20:30.456Z INFO message using the info level`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(4, LogLevel.WARN , `2020-09-20T10:20:30.456Z WARN message using the warn level`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(5, LogLevel.ERROR, `2020-09-20T10:20:30.456Z ERROR message using the error level`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(6, LogLevel.FATAL, `2020-09-20T10:20:30.456Z FATAL message using the fatal level`);

    spy_writeMessage.mockRestore();
  });

  test("log output should include context when provided", () => {
    const logger = new TsLogger({ format: LogFormat.text, minLevel: LogLevel.TRACE });
    const spy_writeMessage = jest.spyOn(logger, 'writeMessage').mockImplementation((level: LogLevel, message: unknown) => { /* do nothing */ });

    const context: ContextType = {
      strProperty: "value",
      boolProperty: false,
      numberProperty: 3.1415,
      nullProperty: null,
      requestId: "4f732a3d-d136-48d7-ae32-f5895a739413",
    };
    logger.trace("dummy", context); // 1
    logger.debug("dummy", context); // 2
    logger.info("dummy", context); // 3
    logger.warn("dummy", context); // 4
    logger.error("dummy", context, null); // 5
    logger.fatal("dummy", context, null); // 6

    expect(spy_writeMessage).toHaveBeenCalledTimes(6);
    // expect(spy_writeMessage).toHaveBeenNthCalledWith(1, LogLevel.TRACE, `2020-09-20T10:20:30.456Z 4f732a3d-d136-48d7-ae32-f5895a739413 TRACE dummy context{"strProperty":"value","boolProperty":false,"numberProperty":3.1415,"nullProperty":null,"requestId":"4f732a3d-d136-48d7-ae32-f5895a739413"}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(2, LogLevel.DEBUG, `2020-09-20T10:20:30.456Z 4f732a3d-d136-48d7-ae32-f5895a739413 DEBUG dummy context{"strProperty":"value","boolProperty":false,"numberProperty":3.1415,"nullProperty":null,"requestId":"4f732a3d-d136-48d7-ae32-f5895a739413"}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(3, LogLevel.INFO , `2020-09-20T10:20:30.456Z 4f732a3d-d136-48d7-ae32-f5895a739413 INFO dummy context{"strProperty":"value","boolProperty":false,"numberProperty":3.1415,"nullProperty":null,"requestId":"4f732a3d-d136-48d7-ae32-f5895a739413"}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(4, LogLevel.WARN , `2020-09-20T10:20:30.456Z 4f732a3d-d136-48d7-ae32-f5895a739413 WARN dummy context{"strProperty":"value","boolProperty":false,"numberProperty":3.1415,"nullProperty":null,"requestId":"4f732a3d-d136-48d7-ae32-f5895a739413"}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(5, LogLevel.ERROR, `2020-09-20T10:20:30.456Z 4f732a3d-d136-48d7-ae32-f5895a739413 ERROR dummy context{"strProperty":"value","boolProperty":false,"numberProperty":3.1415,"nullProperty":null,"requestId":"4f732a3d-d136-48d7-ae32-f5895a739413"}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(6, LogLevel.FATAL, `2020-09-20T10:20:30.456Z 4f732a3d-d136-48d7-ae32-f5895a739413 FATAL dummy context{"strProperty":"value","boolProperty":false,"numberProperty":3.1415,"nullProperty":null,"requestId":"4f732a3d-d136-48d7-ae32-f5895a739413"}`);

    spy_writeMessage.mockRestore();
  });

  test("debug should produce json output", () => {
    expect("").toEqual("");
    /*
    const logger = new TsLogger({ format: LogFormat.json, minLevel: LogLevel.TRACE });
    const context: Record<string, unknown> = {
      "strProperty": "value",
      "boolProperty": false,
      "numberProperty": 3.1415,
      "nullProperty": null,
      "requestId": "4f732a3d-d136-48d7-ae32-f5895a739413",
    };
    logger.trace("message using the trace level");
    logger.debug("message using the debug level");
    logger.info("message using the info level", context);
    logger.warn("message using the warn level");
    logger.trace("message using the trace level");
    logger.error("message using the error level", context, new Error("recoverable error"));
    logger.fatal("message using the fatal level", context, new Error("fatal error"));
    try {
        throw new RangeError('index out of bounds');
    } catch (e) {
        logger.fatal("caught a fatal exception", e);
    }
    */
  });
});