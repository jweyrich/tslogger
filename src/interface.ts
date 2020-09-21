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
    formatTrace(trace: ILogTrace): string;
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

    // useStructuredErrors: default is `false`
    useStructuredErrors?: boolean;

    // ...
    requestIdGetter?: TRequestIdGetterFn;
}

//
// Log entry
//

export declare type ILogTrace = Error;

export interface ILogEntry {
    timestamp?: Date;
    requestId?: string;
    level?: LogLevel;
    message?: string;
    exception?: Error;
    context?: ContextType;
    trace?: ILogTrace;
}

export class TLogEntry implements ILogEntry {
    public timestamp?: Date;
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