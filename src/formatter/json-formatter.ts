import * as ErrorStackParser from 'error-stack-parser';
import {
    ContextType,
    ILoggerSettings,
    ILogEntryError,
    ILogEntryTrace,
    ILogFormatter,
    LogLevel,
    ILogTrace,
    ILogEntry
} from '../interface';
import { BaseFormatter } from './base-formatter';

export class JSONFormatter extends BaseFormatter implements ILogFormatter {
    constructor(settings: ILoggerSettings) { super(settings); }

    public format(entry: ILogEntry): string {
        const obj: Record<string, unknown> = {};

        if (entry.time) {
            obj['time'] = entry.time.toISOString();
        }
        if (entry.requestId) {
            obj['requestId'] = entry.requestId;
        }
        if (entry.hostname) {
            obj['hostname'] = entry.hostname;
        }
        if (entry.level) {
            obj['level'] = LogLevel[entry.level];
        }
        if (entry.message) {
            obj['message'] = entry.message;
        }
        if (entry.exception) {
            obj['exception'] = this.formatError(entry.exception);
        }
        if (entry.context) {
            obj['context'] = this.formatContext(entry.context);
        }
        if (entry.trace) {
            obj['trace'] = this.formatTrace(entry.trace);
        }

        return JSON.stringify(obj);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public formatError(error: Error): any {
        const frames: ErrorStackParser.StackFrame[] = this.stackFrames(error);
        const result: ILogEntryError = {
            name: error.name,
            message: error.message,
            frames: this._settings.useStructuredStacktraces ? frames : this.convertStackFrames(frames)
        };
        return result;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public formatContext(context: ContextType): any {
        return context;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public formatTrace(trace: ILogTrace): any {
        // We don't use `console.trace` because it prepends a "Trace:" to the generated output.
        // Slice the 1st frame since it's related to `trace()`.
        const frames: ErrorStackParser.StackFrame[] = this.stackFrames(trace).slice(1);
        const result: ILogEntryTrace = {
            frames: this._settings.useStructuredStacktraces ? frames : this.convertStackFrames(frames)
        };
        return result;
    }
}
