//import { inspect } from 'util';
import * as ErrorStackParser from 'error-stack-parser';
import { ContextType, ILoggerSettings, ILogEntryError, ILogFormatter, LogLevel, ILogTrace, ILogEntry } from './interface';

export class BaseFormatter {
    protected _settings: ILoggerSettings;

    constructor(settings: ILoggerSettings) {
        this._settings = settings;
    }

    public convertStackFrames(frames: ErrorStackParser.StackFrame[]): string[] {
        const result: string[] = frames.map(frame => frame.source);
        return result;
    }

    public convertContext(context: ContextType): string {
        return JSON.stringify(context);
    }
}

export class TextFormatter extends BaseFormatter implements ILogFormatter {
    constructor(settings: ILoggerSettings) { super(settings); }

    public format(entry: ILogEntry): string {
        const items: Array<unknown> = [];

        if (entry.timestamp) {
            items.push(entry.timestamp.toISOString());
        }
        if (entry.requestId) {
            items.push(entry.requestId);
        }
        if (entry.level) {
            items.push(LogLevel[entry.level]);
        }
        if (entry.message) {
            items.push(entry.message);
        }
        if (entry.exception) {
            items.push(this.formatError(entry.exception));
        }
        if (entry.context) {
            items.push(this.formatContext(entry.context));
        }
        if (entry.trace) {
            items.push(this.formatTrace(entry.trace));
        }

        return items.join(' ');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public formatError(error: Error): any {
        const frames: ErrorStackParser.StackFrame[] = ErrorStackParser.parse(error);
        const frames_as_string: string[] = this.convertStackFrames(frames);
        return `error{"${error.name}","${error.message}"}\nStacktrace:\n${frames_as_string.join('\n')}`;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public formatContext(context: ContextType): any {
        // We don't add curly braces and double-quotes because `this.convertContext`
        // already returns a JSON object. Example: {"prop1": 1}
        return `context${this.convertContext(context)}`;
    }

    public formatTrace(trace: ILogTrace): string {
        // We don't use `console.trace` because it prepends a "Trace:" to the generated output.
        const frames: ErrorStackParser.StackFrame[] = ErrorStackParser.parse(trace);
        // Remove frame(s) related to `trace()`
        const frames_as_string: string[] = frames.slice(1).map(frame => frame.source);
        return '\n' + frames_as_string.join('\n');
    }
}

export class JSONFormatter extends BaseFormatter implements ILogFormatter {
    constructor(settings: ILoggerSettings) { super(settings); }

    public format(entry: ILogEntry): string {
        const obj: Record<string, unknown> = {};

        if (entry.timestamp) {
            obj['timestamp'] = entry.timestamp.toISOString();
        }
        if (entry.requestId) {
            obj['requestId'] = entry.requestId;
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
        const frames: ErrorStackParser.StackFrame[] = ErrorStackParser.parse(error);
        const result: ILogEntryError = {
            name: error.name,
            message: error.message,
            frames: frames
        };

        if (!this._settings.useStructuredErrors) {
            const frames_as_string: string[] = this.convertStackFrames(frames);
            result.frames = frames_as_string;
        }

        return result;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public formatContext(context: ContextType): any {
        return context;
    }

    public formatTrace(trace: ILogTrace): string {
        // We don't use `console.trace` because it prepends a "Trace:" to the generated output.
        const frames: ErrorStackParser.StackFrame[] = ErrorStackParser.parse(trace);
        // Remove frame(s) related to `trace()`
        const frames_as_string: string[] = frames.slice(1).map(frame => frame.source);
        return '\n' + frames_as_string.join('\n');
    }
}
