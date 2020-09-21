"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONFormatter = exports.TextFormatter = exports.BaseFormatter = void 0;
//import { inspect } from 'util';
const ErrorStackParser = require("error-stack-parser");
const interface_1 = require("./interface");
class BaseFormatter {
    constructor(settings) {
        this._settings = settings;
    }
    convertStackFrames(frames) {
        const result = frames.map(frame => frame.source);
        return result;
    }
    convertContext(context) {
        return JSON.stringify(context);
    }
}
exports.BaseFormatter = BaseFormatter;
class TextFormatter extends BaseFormatter {
    constructor(settings) { super(settings); }
    format(entry) {
        const items = [];
        if (entry.timestamp) {
            items.push(entry.timestamp.toISOString());
        }
        if (entry.requestId) {
            items.push(entry.requestId);
        }
        if (entry.level) {
            items.push(interface_1.LogLevel[entry.level]);
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
        return items.join(' ');
    }
    formatError(error) {
        let result = '';
        const frames = ErrorStackParser.parse(error);
        const frames_as_string = this.convertStackFrames(frames);
        return `error{"${error.name}","${error.message}"}\nStacktrace:\n${frames_as_string.join('\n')}`;
    }
    formatContext(context) {
        // We don't add curly braces and double-quotes because `this.convertContext`
        // already returns a JSON object. Example: {"prop1": 1}
        return `context${this.convertContext(context)}`;
    }
    formatTrace(trace) {
        let result = '';
        // We don't use `console.trace` because it prepends a "Trace:" to the generated output.
        const frames = ErrorStackParser.parse(trace);
        // Remove frame(s) related to `trace()`
        const frames_as_string = frames.slice(1).map(frame => frame.source);
        return '\n' + frames_as_string.join('\n');
    }
}
exports.TextFormatter = TextFormatter;
class JSONFormatter extends BaseFormatter {
    constructor(settings) { super(settings); }
    format(entry) {
        const obj = {};
        if (entry.timestamp) {
            obj['timestamp'] = entry.timestamp.toISOString();
        }
        if (entry.requestId) {
            obj['requestId'] = entry.requestId;
        }
        if (entry.level) {
            obj['level'] = interface_1.LogLevel[entry.level];
        }
        if (entry.message) {
            obj['message'] = entry.message;
        }
        if (entry.exception) {
            obj['exception'] = this.formatError(entry.exception);
        }
        if (entry.context) {
            obj['context'] = this.formatContext(entry.context);
        }
        if (entry.trace) {
            obj['trace'] = this.formatTrace(entry.trace);
        }
        return JSON.stringify(obj);
    }
    formatError(error) {
        const frames = ErrorStackParser.parse(error);
        const result = {
            name: error.name,
            message: error.message,
            frames: frames
        };
        if (!this._settings.useStructuredErrors) {
            const frames_as_string = this.convertStackFrames(frames);
            result.frames = frames_as_string;
        }
        return result;
    }
    formatContext(context) {
        return context;
    }
    formatTrace(trace) {
        let result = '';
        // We don't use `console.trace` because it prepends a "Trace:" to the generated output.
        const frames = ErrorStackParser.parse(trace);
        // Remove frame(s) related to `trace()`
        const frames_as_string = frames.slice(1).map(frame => frame.source);
        return '\n' + frames_as_string.join('\n');
    }
}
exports.JSONFormatter = JSONFormatter;
//# sourceMappingURL=formatter.js.map