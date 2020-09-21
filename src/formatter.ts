//import { inspect } from 'util';
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
} from './interface';

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

    public stackFrames(error: Error): ErrorStackParser.StackFrame[] {
        return ErrorStackParser.parse(error);
    }
}

export class TextFormatter extends BaseFormatter implements ILogFormatter {
    constructor(settings: ILoggerSettings) { super(settings); }

    public static get joinChar(): string {
        return ' ';
    }

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

        // IMPORTANT: Remember we always have this joinChar even if there's a '\n' at the beggining/end!
        return items.join(TextFormatter.joinChar);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public formatError(error: Error): any {
        const frames: ErrorStackParser.StackFrame[] = this.stackFrames(error);
        const frames_as_string: string[] = this.convertStackFrames(frames);
        return `error{"${error.name}","${error.message}"}${TextFormatter.joinChar}\nError:\n${frames_as_string.join('\n')}`;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public formatContext(context: ContextType): any {
        // We don't add curly braces and double-quotes because `this.convertContext`
        // already returns a JSON object. Example: {"prop1": 1}
        return `context${this.convertContext(context)}`;
    }

    public formatTrace(trace: ILogTrace): string {
        // We don't use `console.trace` because it prepends a "Trace:" to the generated output.
        const frames: ErrorStackParser.StackFrame[] = this.stackFrames(trace);
        // Remove frame(s) related to `trace()`
        const frames_as_string: string[] = frames.slice(1).map(frame => frame.source);
        return `\nTrace:\n${frames_as_string.join('\n')}`;
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
