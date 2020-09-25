import { ContextType, THostnameGetterFn } from '../src/interface';
import * as ErrorStackParser from 'error-stack-parser';

const ConstantDateString = '2020-09-20T10:20:30.456Z';
const ConstantDateInstance = new Date(ConstantDateString);

const mockedTrace_text = ''
  // The 1st line of the stack trace is automatically stripped by `TextFormatter.formatTrace` and `JSONFormatter.formatTrace`.
  //+'    at Object.<anonymous> (/var/app/scratch/my project/index.js:2:9)\n'
  +'    at Module._compile (internal/modules/cjs/loader.js:774:30)\n'
  +'    at Object.Module._extensions..js (internal/modules/cjs/loader.js:785:10)\n'
  +'    at Module.load (internal/modules/cjs/loader.js:641:32)\n'
  +'    at Function.Module._load (internal/modules/cjs/loader.js:556:12)\n'
  +'    at Function.Module.runMain (internal/modules/cjs/loader.js:837:10)\n'
  +'    at internal/main/run_main_module.js:17:11';

const mockedTrace_json = ''
  + '"trace":{"frames":['
  // The 1st line of the stack trace is automatically stripped by `TextFormatter.formatTrace` and `JSONFormatter.formatTrace`.
  //+ '"    at Object.<anonymous> (/var/app/scratch/my project/index.js:2:9)",'
  + '"    at Module._compile (internal/modules/cjs/loader.js:774:30)",'
  + '"    at Object.Module._extensions..js (internal/modules/cjs/loader.js:785:10)",'
  + '"    at Module.load (internal/modules/cjs/loader.js:641:32)",'
  + '"    at Function.Module._load (internal/modules/cjs/loader.js:556:12)",'
  + '"    at Function.Module.runMain (internal/modules/cjs/loader.js:837:10)",'
  + '"    at internal/main/run_main_module.js:17:11"'
  + ']}';

const mockedError: Error = {
    name: 'Error',
    message: '',
    stack: 'Error\n'
      +'    at Object.<anonymous> (/var/app/scratch/my project/index.js:2:9)\n'
      +'    at Module._compile (internal/modules/cjs/loader.js:774:30)\n'
      +'    at Object.Module._extensions..js (internal/modules/cjs/loader.js:785:10)\n'
      +'    at Module.load (internal/modules/cjs/loader.js:641:32)\n'
      +'    at Function.Module._load (internal/modules/cjs/loader.js:556:12)\n'
      +'    at Function.Module.runMain (internal/modules/cjs/loader.js:837:10)\n'
      +'    at internal/main/run_main_module.js:17:11'
  };

const mockedError_text = ''
  +'    at Object.<anonymous> (/var/app/scratch/my project/index.js:2:9)\n'
  +'    at Module._compile (internal/modules/cjs/loader.js:774:30)\n'
  +'    at Object.Module._extensions..js (internal/modules/cjs/loader.js:785:10)\n'
  +'    at Module.load (internal/modules/cjs/loader.js:641:32)\n'
  +'    at Function.Module._load (internal/modules/cjs/loader.js:556:12)\n'
  +'    at Function.Module.runMain (internal/modules/cjs/loader.js:837:10)\n'
  +'    at internal/main/run_main_module.js:17:11';

const mockedError_json = String(mockedError);

class MockedDate extends Date {
  /* eslint-disable */
  // @ts-ignore Constructors for derived classes must contain a 'super' call.ts(2377)
  constructor() {
    return ConstantDateInstance;
  }
  /* eslint-enable */
}

function mockedHostname(context: ContextType): string {
  return 'host1';
}

type TMockStackFramesFn = (error: Error) => (error: Error) => ErrorStackParser.StackFrame[];


function mockedStackFramesFn(error: Error): (error: Error) => ErrorStackParser.StackFrame[] {
  const desiredError: Error = error;
  function func(error: Error): ErrorStackParser.StackFrame[] {
    return ErrorStackParser.parse(desiredError);
  }
  return func;
}

interface StackDefinition {
  object: Error;
  text: string;
  json: string;
}

interface MockDefinition {
  OriginalDateImpl: DateConstructor;
  DateImpl: unknown;
  dateString: string;
  dateInstance: Date;
  trace: StackDefinition,
  error: StackDefinition,
  hostname: THostnameGetterFn,
  stackFramesFn: TMockStackFramesFn,
}

export const mock: MockDefinition = {
  OriginalDateImpl: Date,
  DateImpl: MockedDate,
  dateString: '2020-09-20T10:20:30.456Z',
  dateInstance: new Date(ConstantDateString),
  trace: {
      object: null,
      text: mockedTrace_text,
      json: mockedTrace_json,
  },
  error: {
      object: mockedError,
      text: mockedError_text,
      json: mockedError_json,
  },
  hostname: mockedHostname,
  stackFramesFn: mockedStackFramesFn,
};
