import { ILoggerSettings, LogLevel, ILogTrace, ILogEntry } from './interface';
export declare const LOG_LEVEL: string, LOG_FORMAT: string, LOG_ADAPTER: string;
export declare class TsLogger {
    private _defaultSettings;
    private _currentSettings;
    private _formatter;
    constructor(settings?: ILoggerSettings);
    get settings(): ILoggerSettings;
    protected writeLogEntry(entry: ILogEntry): ILogEntry;
    protected newEntry(level: LogLevel, message: string, exception: Error, context: object, trace: ILogTrace): ILogEntry;
    trace(message: string, context?: any): ILogEntry;
    debug(message: string, context?: any): ILogEntry;
    info(message: string, context?: any): ILogEntry;
    warn(message: string, context?: any): ILogEntry;
    error(message: string, exception?: Error, context?: any): ILogEntry;
    fatal(message: string, exception?: Error, context?: any): ILogEntry;
}
