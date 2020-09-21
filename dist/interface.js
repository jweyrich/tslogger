"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TLogEntry = exports.LogFormat = exports.LogLevel = void 0;
//
// Level
//
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["TRACE"] = 1] = "TRACE";
    LogLevel[LogLevel["DEBUG"] = 2] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 3] = "INFO";
    LogLevel[LogLevel["WARN"] = 4] = "WARN";
    LogLevel[LogLevel["ERROR"] = 5] = "ERROR";
    LogLevel[LogLevel["FATAL"] = 6] = "FATAL";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
//
// Format
//
var LogFormat;
(function (LogFormat) {
    LogFormat[LogFormat["text"] = 0] = "text";
    LogFormat[LogFormat["json"] = 1] = "json";
})(LogFormat = exports.LogFormat || (exports.LogFormat = {}));
class TLogEntry {
}
exports.TLogEntry = TLogEntry;
//# sourceMappingURL=interface.js.map