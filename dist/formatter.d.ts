import * as ErrorStackParser from 'error-stack-parser';
import { ILoggerSettings, ILogEntryError, ILogFormatter, ILogTrace, ILogEntry } from './interface';
export declare class BaseFormatter {
    protected _settings: ILoggerSettings;
    constructor(settings: ILoggerSettings);
    convertStackFrames(frames: ErrorStackParser.StackFrame[]): string[];
    convertContext(context: object): string;
}
export declare class TextFormatter extends BaseFormatter implements ILogFormatter {
    constructor(settings: ILoggerSettings);
    format(entry: ILogEntry): any;
    formatError(error: Error): string;
    formatContext(context: object): string;
    formatTrace(trace: ILogTrace): string;
}
export declare class JSONFormatter extends BaseFormatter implements ILogFormatter {
    constructor(settings: ILoggerSettings);
    format(entry: ILogEntry): any;
    formatError(error: Error): ILogEntryError;
    formatContext(context: object): object;
    formatTrace(trace: ILogTrace): string;
}
