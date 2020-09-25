//import { inspect } from 'util';
import * as ErrorStackParser from 'error-stack-parser';
import { ContextType, ILoggerSettings } from '../interface';

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
