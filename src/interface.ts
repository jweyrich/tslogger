import * as ErrorStackParser from 'error-stack-parser';

export declare type ContextType = unknown;

//
// Level
//

export enum LogLevel {
    TRACE = 1,
    DEBUG,
    INFO,
    WARN,
    ERROR,
    FATAL,
}

export type LogLevelName = keyof typeof LogLevel;

//
// Format
//

export enum LogFormat {
    text,
    json
}

export type LogFormatName = keyof typeof LogFormat;

export interface ILogFormatter {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    format(entry: ILogEntry): any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatError(error: Error): any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatContext(context: ContextType): any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatTrace(trace: ILogTrace): any;
    stackFrames(error: Error): ErrorStackParser.StackFrame[];
}

//
// Settings
//

export declare type TRequestIdGetterFn = (context: ContextType) => string;

export interface ILoggerSettings {
    name?: string;

    // minLevel: default is `process.env.LOG_LEVEL` or `LogLevel.INFO`
    minLevel?: LogLevel;

    // format: default is `LogFormat.text`
    format?: LogFormat;

    // useStructuredStacktraces: default is `false`
    useStructuredStacktraces?: boolean;

    // ...
    requestIdGetter?: TRequestIdGetterFn;
}

//
// Log entry
//

export declare type ILogTrace = Error;

export interface ILogEntry {
    time?: Date;
    requestId?: string;
    level?: LogLevel;
    message?: string;
    exception?: Error;
    context?: ContextType;
    trace?: ILogTrace;
}

export class TLogEntry implements ILogEntry {
    public time?: Date;
    public requestId?: string;
    public level?: LogLevel;
    public message?: string;
    public exception?: Error;
    public context?: ContextType;
    public trace?: ILogTrace;
}

export interface ILogEntryError {
    name: string;
    message: string;
    frames: ErrorStackParser.StackFrame[] | string[];
}

export interface ILogEntryTrace {
    frames: ErrorStackParser.StackFrame[] | string[];
}

//
// Logger
//

export interface ILogger {
    trace(message: string, context?: ContextType): ILogEntry;
    debug(message: string, context?: ContextType): ILogEntry;
    info(message: string, context?: ContextType): ILogEntry;
    warn(message: string, context?: ContextType): ILogEntry;
    error(message: string, context?: ContextType, exception?: Error): ILogEntry;
    fatal(message: string, context?: ContextType, exception?: Error): ILogEntry;
}