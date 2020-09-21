"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsLogger = exports.LOG_ADAPTER = exports.LOG_FORMAT = exports.LOG_LEVEL = void 0;
const interface_1 = require("./interface");
const formatter_1 = require("./formatter");
_a = process.env, exports.LOG_LEVEL = _a.LOG_LEVEL, exports.LOG_FORMAT = _a.LOG_FORMAT, exports.LOG_ADAPTER = _a.LOG_ADAPTER;
class TsLogger {
    constructor(settings) {
        this._currentSettings = {};
        this._defaultSettings = {
            minLevel: (settings === null || settings === void 0 ? void 0 : settings.minLevel) || interface_1.LogLevel[exports.LOG_LEVEL] || interface_1.LogLevel.INFO,
            name: (settings === null || settings === void 0 ? void 0 : settings.name) || undefined,
            format: (settings === null || settings === void 0 ? void 0 : settings.format) || interface_1.LogFormat[exports.LOG_FORMAT] || interface_1.LogFormat.text,
            useStructuredErrors: false,
            //maskValuesOfKeys: ["authorization", "password", "senha"],
            //maskPlaceholder: "***",
            requestIdGetter: (context) => {
                return context ? context['requestId'] : null;
                //return ctx.request.headers['x-request-id'] as string;
            }
        };
        const newSettings = settings !== null && settings !== void 0 ? settings : {};
        this._currentSettings = Object.assign(Object.assign({}, this._defaultSettings), newSettings);
        switch (this._currentSettings.format) {
            default: throw Error('unhandled log format');
            case interface_1.LogFormat.text:
                this._formatter = new formatter_1.TextFormatter(this._currentSettings);
                break;
            case interface_1.LogFormat.json:
                this._formatter = new formatter_1.JSONFormatter(this._currentSettings);
                break;
        }
    }
    get settings() {
        // Return a read-only copy.
        return Object.assign({}, this._currentSettings);
    }
    writeLogEntry(entry) {
        if (entry.level < this._currentSettings.minLevel)
            return null;
        const formatted = this._formatter.format(entry);
        switch (entry.level) {
            case interface_1.LogLevel.TRACE:
            case interface_1.LogLevel.DEBUG:
                console.debug(formatted);
                break;
            case interface_1.LogLevel.INFO:
                console.info(formatted);
                break;
            case interface_1.LogLevel.WARN:
                console.warn(formatted);
                break;
            case interface_1.LogLevel.ERROR:
                console.error(formatted);
                break;
            case interface_1.LogLevel.FATAL:
                console.error(formatted);
                break;
        }
        return entry;
    }
    newEntry(level, message, exception, context, trace) {
        const entry = new interface_1.TLogEntry();
        entry.timestamp = new Date();
        entry.requestId = this._currentSettings.requestIdGetter(context);
        entry.level = level;
        entry.message = message;
        entry.exception = exception;
        entry.context = context;
        entry.trace = trace;
        return entry;
    }
    trace(message, context) {
        const level = interface_1.LogLevel.TRACE;
        const entry = this.newEntry(level, message, null, context, new Error());
        return this.writeLogEntry(entry);
    }
    debug(message, context) {
        const level = interface_1.LogLevel.DEBUG;
        const entry = this.newEntry(level, message, null, context, null);
        return this.writeLogEntry(entry);
    }
    info(message, context) {
        const level = interface_1.LogLevel.INFO;
        const entry = this.newEntry(level, message, null, context, null);
        return this.writeLogEntry(entry);
    }
    warn(message, context) {
        const level = interface_1.LogLevel.WARN;
        const entry = this.newEntry(level, message, null, context, null);
        return this.writeLogEntry(entry);
    }
    error(message, exception, context) {
        const level = interface_1.LogLevel.ERROR;
        const entry = this.newEntry(level, message, exception, context, null);
        return this.writeLogEntry(entry);
    }
    fatal(message, exception, context) {
        const level = interface_1.LogLevel.FATAL;
        const entry = this.newEntry(level, message, exception, context, null);
        return this.writeLogEntry(entry);
    }
}
exports.TsLogger = TsLogger;
//# sourceMappingURL=logger.js.map