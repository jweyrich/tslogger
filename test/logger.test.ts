import { TsLogger } from '../src/logger';
import { ContextType, LogFormat, LogLevel } from '../src/interface';
import * as ErrorStackParser from 'error-stack-parser';
import { MockedExceptions } from './fixtures/mocked-exceptions';
import { TextFormatter } from '../src/formatter';

describe("the logger", () => {

  const OriginalDateImpl = Date;
  const ConstantDateString = '2020-09-20T10:20:30.456Z';
  const ConstantDateInstance = new Date(ConstantDateString);

  const TraceStackAsString = ''
    // The 1st line of the stack trace is automatically stripped by `TextFormatter.formatTrace` and `JSONFormatter.formatTrace`.
    //+'    at Object.<anonymous> (/var/app/scratch/my project/index.js:2:9)\n'
    +'    at Module._compile (internal/modules/cjs/loader.js:774:30)\n'
    +'    at Object.Module._extensions..js (internal/modules/cjs/loader.js:785:10)\n'
    +'    at Module.load (internal/modules/cjs/loader.js:641:32)\n'
    +'    at Function.Module._load (internal/modules/cjs/loader.js:556:12)\n'
    +'    at Function.Module.runMain (internal/modules/cjs/loader.js:837:10)\n'
    +'    at internal/main/run_main_module.js:17:11';

  const TraceStackAsJson = ''
    + '"trace":{"frames":['
    + '"    at Module._compile (internal/modules/cjs/loader.js:774:30)",'
    + '"    at Object.Module._extensions..js (internal/modules/cjs/loader.js:785:10)",'
    + '"    at Module.load (internal/modules/cjs/loader.js:641:32)",'
    + '"    at Function.Module._load (internal/modules/cjs/loader.js:556:12)",'
    + '"    at Function.Module.runMain (internal/modules/cjs/loader.js:837:10)",'
    + '"    at internal/main/run_main_module.js:17:11"'
    + ']}';

  const ErrorStackAsString = ''
    +'    at Object.<anonymous> (/var/app/scratch/my project/index.js:2:9)\n'
    +'    at Module._compile (internal/modules/cjs/loader.js:774:30)\n'
    +'    at Object.Module._extensions..js (internal/modules/cjs/loader.js:785:10)\n'
    +'    at Module.load (internal/modules/cjs/loader.js:641:32)\n'
    +'    at Function.Module._load (internal/modules/cjs/loader.js:556:12)\n'
    +'    at Function.Module.runMain (internal/modules/cjs/loader.js:837:10)\n'
    +'    at internal/main/run_main_module.js:17:11';

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

  test("text output should be [time level message]", () => {
    const logger = new TsLogger({ format: LogFormat.text, minLevel: LogLevel.TRACE });
    const spy_writeMessage = jest.spyOn(logger, 'writeMessage').mockImplementation((level: LogLevel, message: unknown) => { /* do nothing */ });
    const spy_stackFrames = jest.spyOn(logger.formatter, 'stackFrames').mockImplementation((error: Error): ErrorStackParser.StackFrame[] => {
      return ErrorStackParser.parse(MockedExceptions.NODE_WITH_SPACES);
    });

    logger.trace("message using the trace level"); // 1
    logger.debug("message using the debug level"); // 2
    logger.info("message using the info level"); // 3
    logger.warn("message using the warn level"); // 4
    logger.error("message using the error level"); // 5
    logger.fatal("message using the fatal level"); // 6

    expect(spy_writeMessage).toHaveBeenCalledTimes(6);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(1, LogLevel.TRACE, `2020-09-20T10:20:30.456Z TRACE message using the trace level${TextFormatter.joinChar}\nTrace:\n${TraceStackAsString}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(2, LogLevel.DEBUG, `2020-09-20T10:20:30.456Z DEBUG message using the debug level`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(3, LogLevel.INFO , `2020-09-20T10:20:30.456Z INFO message using the info level`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(4, LogLevel.WARN , `2020-09-20T10:20:30.456Z WARN message using the warn level`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(5, LogLevel.ERROR, `2020-09-20T10:20:30.456Z ERROR message using the error level`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(6, LogLevel.FATAL, `2020-09-20T10:20:30.456Z FATAL message using the fatal level`);

    spy_stackFrames.mockRestore();
    spy_writeMessage.mockRestore();
  });

  test("text output should include context when provided", () => {
    const logger = new TsLogger({ format: LogFormat.text, minLevel: LogLevel.TRACE });
    const spy_writeMessage = jest.spyOn(logger, 'writeMessage').mockImplementation((level: LogLevel, message: unknown) => { /* do nothing */ });
    const spy_stackFrames = jest.spyOn(logger.formatter, 'stackFrames').mockImplementation((error: Error): ErrorStackParser.StackFrame[] => {
      return ErrorStackParser.parse(MockedExceptions.NODE_WITH_SPACES);
    });

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
    expect(spy_writeMessage).toHaveBeenNthCalledWith(1, LogLevel.TRACE, `2020-09-20T10:20:30.456Z 4f732a3d-d136-48d7-ae32-f5895a739413 TRACE dummy context{"strProperty":"value","boolProperty":false,"numberProperty":3.1415,"nullProperty":null,"requestId":"4f732a3d-d136-48d7-ae32-f5895a739413"}${TextFormatter.joinChar}\nTrace:\n${TraceStackAsString}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(2, LogLevel.DEBUG, `2020-09-20T10:20:30.456Z 4f732a3d-d136-48d7-ae32-f5895a739413 DEBUG dummy context{"strProperty":"value","boolProperty":false,"numberProperty":3.1415,"nullProperty":null,"requestId":"4f732a3d-d136-48d7-ae32-f5895a739413"}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(3, LogLevel.INFO , `2020-09-20T10:20:30.456Z 4f732a3d-d136-48d7-ae32-f5895a739413 INFO dummy context{"strProperty":"value","boolProperty":false,"numberProperty":3.1415,"nullProperty":null,"requestId":"4f732a3d-d136-48d7-ae32-f5895a739413"}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(4, LogLevel.WARN , `2020-09-20T10:20:30.456Z 4f732a3d-d136-48d7-ae32-f5895a739413 WARN dummy context{"strProperty":"value","boolProperty":false,"numberProperty":3.1415,"nullProperty":null,"requestId":"4f732a3d-d136-48d7-ae32-f5895a739413"}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(5, LogLevel.ERROR, `2020-09-20T10:20:30.456Z 4f732a3d-d136-48d7-ae32-f5895a739413 ERROR dummy context{"strProperty":"value","boolProperty":false,"numberProperty":3.1415,"nullProperty":null,"requestId":"4f732a3d-d136-48d7-ae32-f5895a739413"}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(6, LogLevel.FATAL, `2020-09-20T10:20:30.456Z 4f732a3d-d136-48d7-ae32-f5895a739413 FATAL dummy context{"strProperty":"value","boolProperty":false,"numberProperty":3.1415,"nullProperty":null,"requestId":"4f732a3d-d136-48d7-ae32-f5895a739413"}`);

    spy_stackFrames.mockRestore();
    spy_writeMessage.mockRestore();
  });

  test("text output should include errors when provided", () => {
    const logger = new TsLogger({ format: LogFormat.text, minLevel: LogLevel.TRACE });
    const spy_writeMessage = jest.spyOn(logger, 'writeMessage').mockImplementation((level: LogLevel, message: unknown) => { /* do nothing */ });
    const spy_stackFrames = jest.spyOn(logger.formatter, 'stackFrames').mockImplementation((error: Error): ErrorStackParser.StackFrame[] => {
      return ErrorStackParser.parse(MockedExceptions.NODE_WITH_SPACES);
    });

    logger.trace("dummy"); // 1
    logger.error("dummy", null, new Error("dummy error")); // 2
    logger.fatal("dummy", null, new Error("dummy error")); // 3

    expect(spy_writeMessage).toHaveBeenCalledTimes(3);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(1, LogLevel.TRACE, `2020-09-20T10:20:30.456Z TRACE dummy${TextFormatter.joinChar}\nTrace:\n${TraceStackAsString}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(2, LogLevel.ERROR, `2020-09-20T10:20:30.456Z ERROR dummy error{"Error","dummy error"}${TextFormatter.joinChar}\nError:\n${ErrorStackAsString}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(3, LogLevel.FATAL, `2020-09-20T10:20:30.456Z FATAL dummy error{"Error","dummy error"}${TextFormatter.joinChar}\nError:\n${ErrorStackAsString}`);

    spy_stackFrames.mockRestore();
    spy_writeMessage.mockRestore();
  });

  test("json output should be a valid JSON with {time, level message}", () => {
    const logger = new TsLogger({ format: LogFormat.json, minLevel: LogLevel.TRACE });
    const spy_writeMessage = jest.spyOn(logger, 'writeMessage').mockImplementation((level: LogLevel, message: unknown) => { /* do nothing */ });
    const spy_stackFrames = jest.spyOn(logger.formatter, 'stackFrames').mockImplementation((error: Error): ErrorStackParser.StackFrame[] => {
      return ErrorStackParser.parse(MockedExceptions.NODE_WITH_SPACES);
    });

    logger.trace("message using the trace level"); // 1
    logger.debug("message using the debug level"); // 2
    logger.info("message using the info level"); // 3
    logger.warn("message using the warn level"); // 4
    logger.error("message using the error level"); // 5
    logger.fatal("message using the fatal level"); // 6

    expect(spy_writeMessage).toHaveBeenCalledTimes(6);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(1, LogLevel.TRACE, `{"time":"2020-09-20T10:20:30.456Z","level":"TRACE","message":"message using the trace level",${TraceStackAsJson}}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(2, LogLevel.DEBUG, `{"time":"2020-09-20T10:20:30.456Z","level":"DEBUG","message":"message using the debug level"}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(3, LogLevel.INFO , `{"time":"2020-09-20T10:20:30.456Z","level":"INFO","message":"message using the info level"}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(4, LogLevel.WARN , `{"time":"2020-09-20T10:20:30.456Z","level":"WARN","message":"message using the warn level"}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(5, LogLevel.ERROR, `{"time":"2020-09-20T10:20:30.456Z","level":"ERROR","message":"message using the error level"}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(6, LogLevel.FATAL, `{"time":"2020-09-20T10:20:30.456Z","level":"FATAL","message":"message using the fatal level"}`);

    spy_stackFrames.mockRestore();
    spy_writeMessage.mockRestore();
  });
});