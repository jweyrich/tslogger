import { TsLogger, LogFormat, LogLevel } from '../src';
import { mock } from './mock-data';

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
});