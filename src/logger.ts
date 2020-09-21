import {
    ContextType,
    ILoggerSettings,
    LogLevel, LogLevelName,
    LogFormat, LogFormatName, ILogFormatter,
    ILogTrace,
    ILogEntry, TLogEntry
} from './interface';
import { TextFormatter, JSONFormatter } from './formatter';

export class TsLogger {
    protected _defaultSettings: ILoggerSettings;
    protected _currentSettings: ILoggerSettings = {};
    protected _formatter: ILogFormatter;

    constructor(settings?: ILoggerSettings) {
        const { LOG_LEVEL, LOG_FORMAT } = process.env;

        this._defaultSettings = {
            minLevel: settings?.minLevel || LogLevel[LOG_LEVEL as LogLevelName] || LogLevel.INFO,
            name: settings?.name || undefined,
            format: settings?.format || LogFormat[LOG_FORMAT as LogFormatName] || LogFormat.text,
            useStructuredErrors: false,
            //maskValuesOfKeys: ["authorization", "password", "senha"],
            //maskPlaceholder: "***",

            requestIdGetter: (context: ContextType): string => {
                const contextRecord: Record<string,unknown> = context as Record<string,unknown>;
                return context ? String(contextRecord['requestId']) : null;
                //return ctx.request.headers['x-request-id'] as string;
            }
        };
        const newSettings: ILoggerSettings = settings ?? {};

        this._currentSettings = {
            ...this._defaultSettings,
            ...newSettings,
        };

        switch (this._currentSettings.format) {
            default: throw Error('unhandled log format');
            case LogFormat.text:
                this._formatter = new TextFormatter(this._currentSettings);
                break;
            case LogFormat.json:
                this._formatter = new JSONFormatter(this._currentSettings);
                break;
        }
    }

    public get settings(): ILoggerSettings {
        // Return a read-only copy.
        return { ...this._currentSettings };
    }

    public writeMessage(level: LogLevel, message: unknown): void {
        switch (level) {
            case LogLevel.TRACE:
            case LogLevel.DEBUG:
                console.debug(message); // eslint-disable-line no-console
                break;
            case LogLevel.INFO:
                console.info(message); // eslint-disable-line no-console
                break;
            case LogLevel.WARN:
                console.warn(message); // eslint-disable-line no-console
                break;
            case LogLevel.ERROR:
                console.error(message); // eslint-disable-line no-console
                break;
            case LogLevel.FATAL:
                console.error(message); // eslint-disable-line no-console
                break;
        }
    }

    public writeLogEntry(entry: ILogEntry): void {
        if (entry.level < this._currentSettings.minLevel)
            return null;

        const formatted: unknown = this._formatter.format(entry);
        this.writeMessage(entry.level, formatted);
    }

    public newEntry(level: LogLevel, message: string, context: ContextType, exception: Error, trace: ILogTrace): ILogEntry {
        const entry: ILogEntry = new TLogEntry();
        entry.timestamp = new Date();
        entry.requestId = this._currentSettings.requestIdGetter(context);
        entry.level = level;
        entry.message = message;
        entry.exception = exception;
        entry.context = context;
        entry.trace = trace;
        return entry;
    }

    public trace(message: string, context?: ContextType): ILogEntry {
        const level = LogLevel.TRACE;
        const entry: ILogEntry = this.newEntry(level, message, context, null, new Error());
        this.writeLogEntry(entry);
        return entry;
    }

    public debug(message: string, context?: ContextType): ILogEntry {
        const level = LogLevel.DEBUG;
        const entry: ILogEntry = this.newEntry(level, message, context, null, null);
        this.writeLogEntry(entry);
        return entry;
    }

    public info(message: string, context?: ContextType): ILogEntry {
        const level = LogLevel.INFO;
        const entry: ILogEntry = this.newEntry(level, message, context, null, null);
        this.writeLogEntry(entry);
        return entry;
    }

    public warn(message: string, context?: ContextType): ILogEntry {
        const level = LogLevel.WARN;
        const entry: ILogEntry = this.newEntry(level, message, context, null, null);
        this.writeLogEntry(entry);
        return entry;
    }

    public error(message: string, context?: ContextType, exception?: Error): ILogEntry {
        const level = LogLevel.ERROR;
        const entry: ILogEntry = this.newEntry(level, message, context, exception, null);
        this.writeLogEntry(entry);
        return entry;
    }

    public fatal(message: string, context?: ContextType, exception?: Error): ILogEntry {
        const level = LogLevel.FATAL;
        const entry: ILogEntry = this.newEntry(level, message, context, exception, null);
        this.writeLogEntry(entry);
        return entry;
    }
}