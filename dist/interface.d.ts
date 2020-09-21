import * as ErrorStackParser from 'error-stack-parser';
export declare enum LogLevel {
    TRACE = 1,
    DEBUG = 2,
    INFO = 3,
    WARN = 4,
    ERROR = 5,
    FATAL = 6
}
export declare type LogLevelName = keyof typeof LogLevel;
export declare enum LogFormat {
    text = 0,
    json = 1
}
export declare type LogFormatName = keyof typeof LogFormat;
export interface ILogFormatter {
    format(entry: ILogEntry): any;
    formatError(error: Error): any;
    formatContext(context: object): any;
    formatTrace(trace: ILogTrace): any;
}
export declare type TRequestIdGetterFn = (context: object) => string;
export interface ILoggerSettings {
    name?: string;
    minLevel?: LogLevel;
    format?: LogFormat;
    useStructuredErrors?: boolean;
    requestIdGetter?: TRequestIdGetterFn;
}
export declare type ILogTrace = Error;
export declare var LogTrace: ErrorConstructor;
export interface ILogEntry {
    timestamp?: Date;
    requestId?: string;
    level?: LogLevel;
    message?: string | object;
    exception?: Error;
    context?: object;
    trace?: ILogTrace;
}
export declare class TLogEntry implements ILogEntry {
    timestamp?: Date;
    requestId?: string;
    level?: LogLevel;
    message?: string | object;
    exception?: Error;
    context?: object;
    trace?: ILogTrace;
}
export interface ILogEntryError {
    name: string;
    message: string;
    frames: ErrorStackParser.StackFrame[] | string[];
}
