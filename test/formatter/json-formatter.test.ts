import { TsLogger, LogFormat, LogLevel } from '../../src';
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

  test("json output should be a valid JSON with {time, level, message}", () => {
    const logger = new TsLogger({ format: LogFormat.json, minLevel: LogLevel.TRACE, hostnameGetter: mock.hostname });
    const spy_writeMessage = jest.spyOn(logger, 'writeMessage').mockImplementation((level: LogLevel, message: unknown) => { /* do nothing */ });
    const spy_stackFrames = jest.spyOn(logger.formatter, 'stackFrames').mockImplementation(mock.stackFramesFn(mock.error.object));

    logger.trace("message using the trace level"); // 1
    logger.debug("message using the debug level"); // 2
    logger.info("message using the info level"); // 3
    logger.warn("message using the warn level"); // 4
    logger.error("message using the error level"); // 5
    logger.fatal("message using the fatal level"); // 6

    expect(spy_writeMessage).toHaveBeenCalledTimes(6);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(1, LogLevel.TRACE, `{"time":"2020-09-20T10:20:30.456Z","hostname":"host1","level":"TRACE","message":"message using the trace level",${mock.trace.json}}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(2, LogLevel.DEBUG, `{"time":"2020-09-20T10:20:30.456Z","hostname":"host1","level":"DEBUG","message":"message using the debug level"}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(3, LogLevel.INFO , `{"time":"2020-09-20T10:20:30.456Z","hostname":"host1","level":"INFO","message":"message using the info level"}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(4, LogLevel.WARN , `{"time":"2020-09-20T10:20:30.456Z","hostname":"host1","level":"WARN","message":"message using the warn level"}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(5, LogLevel.ERROR, `{"time":"2020-09-20T10:20:30.456Z","hostname":"host1","level":"ERROR","message":"message using the error level"}`);
    expect(spy_writeMessage).toHaveBeenNthCalledWith(6, LogLevel.FATAL, `{"time":"2020-09-20T10:20:30.456Z","hostname":"host1","level":"FATAL","message":"message using the fatal level"}`);

    spy_stackFrames.mockRestore();
    spy_writeMessage.mockRestore();
  });
});