import * as ErrorStackParser from 'error-stack-parser';
import {
    ContextType,
    ILoggerSettings,
    ILogFormatter,
    LogLevel,
    ILogTrace,
    ILogEntry
} from '../interface';
import { BaseFormatter } from './base-formatter';

export class TextFormatter extends BaseFormatter implements ILogFormatter {
    constructor(settings: ILoggerSettings) { super(settings); }

    public static get joinChar(): string {
        return ' ';
    }

    public format(entry: ILogEntry): string {
        const items: Array<unknown> = [];

        if (entry.time) {
            items.push(entry.time.toISOString());
        }
        if (entry.requestId) {
            items.push(entry.requestId);
        }
        if (entry.hostname) {
            items.push(entry.hostname);
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
