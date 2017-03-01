'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = require("./Route");
let requestID = 0;
function required(args) {
    return function (target, name, descriptor) {
        return requireDescriptor(target, name, descriptor, args);
    };
}
exports.required = required;
function prefix(prefix) {
    return (target) => {
        target.prototype[Route_1.symbolRoutePrefix] = prefix;
    };
}
exports.prefix = prefix;
function router(config) {
    return (target, name, value) => {
        const prefix = target.constructor.prefix || '';
        const path = prefix + config.path;
        Route_1.Route.__DecoratedRouters.set({
            target: target,
            path: path,
            method: config.method
        }, target[name]);
    };
}
exports.router = router;
function convert(middleware) {
    return decorate(function (target, name, descriptor, middleware) {
        target[name] = sureIsArray(target[name]);
        target[name].splice(target[name].length - 1, 0, middleware);
        return descriptor;
    }, sureIsArray(middleware));
}
exports.convert = convert;
function log(target, name, value) {
    target[name] = sureIsArray(target[name]);
    target[name].splice(target[name].length - 1, 0, Logger);
    function Logger(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentRequestID = requestID++;
            const startTime = process.hrtime();
            console.log(`→ (ID:${currentRequestID}) ${ctx.method} ${ctx.url}`);
            if ((ctx.method).toLowerCase() == 'post') {
                console.log(`→ (ID:${currentRequestID}) ${ctx.method} ${JSON.stringify(ctx.request.body)}`);
            }
            yield next();
            const endTime = process.hrtime();
            const elapsed = (endTime[0] - startTime[0]) * 1000 + (endTime[1] - startTime[1]) / 1000000;
            console.log(`← (ID:${currentRequestID}) ${ctx.method} ${ctx.url} : Status(${ctx.status}) Time(${elapsed.toFixed(0)}ms)`);
        });
    }
    return value;
}
exports.log = log;
function sureIsArray(arr) {
    return Array.isArray(arr) ? arr : [arr];
}
function isDescriptor(desc) {
    if (!desc || !desc.hasOwnProperty)
        return false;
    for (let key of ['value', 'initializer', 'get', 'set']) {
        if (desc.hasOwnProperty(key))
            return true;
    }
    return false;
}
function last(arr) {
    return arr[arr.length - 1];
}
function requireDescriptor(target, name, descriptor, rules) {
    target[name] = sureIsArray(target[name]);
    target[name].splice(target[name].length - 1, 0, middleware);
    return descriptor;
    function middleware(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (rules.query) {
                rules.query = sureIsArray(rules.query);
                for (let name of rules.query) {
                    if (!ctx.query[name])
                        ctx.throw(412, `GET Request query: ${name} required`);
                }
            }
            if (rules.params) {
                rules.params = sureIsArray(rules.params);
                for (let name of rules.params) {
                    if (!ctx.params[name])
                        ctx.throw(412, `GET Request params: ${name} required`);
                }
            }
            yield next();
        });
    }
}
function decorate(handleDescriptor, entryArgs) {
    if (isDescriptor(last(entryArgs)))
        return handleDescriptor(entryArgs);
    else
        return function () {
            return handleDescriptor(...arguments, ...entryArgs);
        };
}
//# sourceMappingURL=index.js.map