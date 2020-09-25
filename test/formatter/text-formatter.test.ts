import { TsLogger, ContextType, LogFormat, LogLevel, TextFormatter } from '../../src';
import { mock } from '../mock-data';

describe("the logger", () => {

  beforeAll(() => {
    /* eslint-disable */
    // @ts-ignore Constructors for derived classes must contain a 'super' call.ts(2377)
    Date = mock.DateImpl;
    /* eslint-enable */
  });

  afterAll(() => {
    // eslint-disable-next-line no-global-assign
    Date = mock.OriginalDateImpl;
  });

  beforeEach(() => {
    // TODO ...
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("text output should be [time level message]", () => {
    const logger = new TsLogger({ format: LogFormat.text, minLevel: LogLevel.TRACE, hostnameGetter: mock.hostname });
    const spy_writeMessage = jest.spyOn(logger, 'writeMessage').mockImplementation((level: LogLevel, message: unknown) => { /* do nothing */ });
    const spy_stackFrames = jest.spyOn(logger.formatter, 'stackFrames').mockImplementation(mock.stackFramesFn(mock.error.object));

    logger.trace("message using the trace level"); // 1
    logger.debug("message using the debug level"); // 2
    logger.info("message using the info level"); // 3
    logger.warn("message using the warn level"); // 4
    logger.error("message using the error level"); // 5
    logger.fatal("message using the fatal level"); // 6

    expect(spy_writeMessage).toHaveBeenCalledTimes(6);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(1, LogLevel.TRACE, `2020-09-20T10:20:30.456Z host1 TRACE message using the trace level${TextFormatter.joinChar}\nTrace:\n${mock.trace.text}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(2, LogLevel.DEBUG, `2020-09-20T10:20:30.456Z host1 DEBUG message using the debug level`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(3, LogLevel.INFO , `2020-09-20T10:20:30.456Z host1 INFO message using the info level`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(4, LogLevel.WARN , `2020-09-20T10:20:30.456Z host1 WARN message using the warn level`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(5, LogLevel.ERROR, `2020-09-20T10:20:30.456Z host1 ERROR message using the error level`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(6, LogLevel.FATAL, `2020-09-20T10:20:30.456Z host1 FATAL message using the fatal level`);

    spy_stackFrames.mockRestore();
    spy_writeMessage.mockRestore();
  });

  test("text output should include context when provided", () => {
    const logger = new TsLogger({ format: LogFormat.text, minLevel: LogLevel.TRACE, hostnameGetter: mock.hostname });
    const spy_writeMessage = jest.spyOn(logger, 'writeMessage').mockImplementation((level: LogLevel, message: unknown) => { /* do nothing */ });
    const spy_stackFrames = jest.spyOn(logger.formatter, 'stackFrames').mockImplementation(mock.stackFramesFn(mock.error.object));

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
    expect(spy_writeMessage).toHaveBeenNthCalledWith(1, LogLevel.TRACE, `2020-09-20T10:20:30.456Z 4f732a3d-d136-48d7-ae32-f5895a739413 host1 TRACE dummy context{"strProperty":"value","boolProperty":false,"numberProperty":3.1415,"nullProperty":null,"requestId":"4f732a3d-d136-48d7-ae32-f5895a739413"}${TextFormatter.joinChar}\nTrace:\n${mock.trace.text}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(2, LogLevel.DEBUG, `2020-09-20T10:20:30.456Z 4f732a3d-d136-48d7-ae32-f5895a739413 host1 DEBUG dummy context{"strProperty":"value","boolProperty":false,"numberProperty":3.1415,"nullProperty":null,"requestId":"4f732a3d-d136-48d7-ae32-f5895a739413"}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(3, LogLevel.INFO , `2020-09-20T10:20:30.456Z 4f732a3d-d136-48d7-ae32-f5895a739413 host1 INFO dummy context{"strProperty":"value","boolProperty":false,"numberProperty":3.1415,"nullProperty":null,"requestId":"4f732a3d-d136-48d7-ae32-f5895a739413"}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(4, LogLevel.WARN , `2020-09-20T10:20:30.456Z 4f732a3d-d136-48d7-ae32-f5895a739413 host1 WARN dummy context{"strProperty":"value","boolProperty":false,"numberProperty":3.1415,"nullProperty":null,"requestId":"4f732a3d-d136-48d7-ae32-f5895a739413"}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(5, LogLevel.ERROR, `2020-09-20T10:20:30.456Z 4f732a3d-d136-48d7-ae32-f5895a739413 host1 ERROR dummy context{"strProperty":"value","boolProperty":false,"numberProperty":3.1415,"nullProperty":null,"requestId":"4f732a3d-d136-48d7-ae32-f5895a739413"}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(6, LogLevel.FATAL, `2020-09-20T10:20:30.456Z 4f732a3d-d136-48d7-ae32-f5895a739413 host1 FATAL dummy context{"strProperty":"value","boolProperty":false,"numberProperty":3.1415,"nullProperty":null,"requestId":"4f732a3d-d136-48d7-ae32-f5895a739413"}`);

    spy_stackFrames.mockRestore();
    spy_writeMessage.mockRestore();
  });

  test("text output should include errors when provided", () => {
    const logger = new TsLogger({ format: LogFormat.text, minLevel: LogLevel.TRACE, hostnameGetter: mock.hostname });
    const spy_writeMessage = jest.spyOn(logger, 'writeMessage').mockImplementation((level: LogLevel, message: unknown) => { /* do nothing */ });
    const spy_stackFrames = jest.spyOn(logger.formatter, 'stackFrames').mockImplementation(mock.stackFramesFn(mock.error.object));

    logger.trace("dummy"); // 1
    logger.error("dummy", null, new Error("dummy error")); // 2
    logger.fatal("dummy", null, new Error("dummy error")); // 3

    expect(spy_writeMessage).toHaveBeenCalledTimes(3);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(1, LogLevel.TRACE, `2020-09-20T10:20:30.456Z host1 TRACE dummy${TextFormatter.joinChar}\nTrace:\n${mock.trace.text}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(2, LogLevel.ERROR, `2020-09-20T10:20:30.456Z host1 ERROR dummy error{"Error","dummy error"}${TextFormatter.joinChar}\nError:\n${mock.error.text}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(3, LogLevel.FATAL, `2020-09-20T10:20:30.456Z host1 FATAL dummy error{"Error","dummy error"}${TextFormatter.joinChar}\nError:\n${mock.error.text}`);

    spy_stackFrames.mockRestore();
    spy_writeMessage.mockRestore();
  });
});