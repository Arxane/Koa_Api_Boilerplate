/**
 * Routing middleware
 */
'use strict';
import {symbolRoutePrefix, Route} from './Route';
import * as Koa from 'koa';

// Record the number of requests
let requestID = 0;

/**
 * url parameter
 * list/:id?username=arxane&&age=30
 * @required({query: 'username'})
 * @required({query: ['username', 'age'], params: 'id'})
 */
export function required (args: any) {
    return function(target: any, name: string, descriptor: PropertyDescriptor) {
        return requireDescriptor(target, name, descriptor, args);
    }
}

/**
 * Add static properties
 * @prefix ('/user')
 */
export function prefix (prefix: string) {
    return (target: any) => {
        target.prototype[symbolRoutePrefix] = prefix;
    }
}

/**
 * Routing
 * @router({
 *  method: 'get',
 *  path: '/login/:id'
 * })
 */
export function router(config: {path: string, method: string}) {
    return (target: any, name: string, value: PropertyDescriptor) => {
        // Get the static attribute of the class, that is, the defined router prefix
        const prefix = target.constructor.prefix || '';
        // Call static attribute, splice route
        const path = prefix + config.path;
        // Map type setting value
        Route.__DecoratedRouters.set({
            target: target,
            path: path,
            method: config.method
        }, target[name]);
    }
}

/**
 * Modification method
 * @convert(async function(ctx, next) {await next()})
 */
export function convert (middleware: Function) {
    return decorate(function(target: any, name: string, descriptor: PropertyDescriptor, middleware: Function) {
        target[name] = sureIsArray(target[name]);
        target[name].splice(target[name].length - 1, 0, middleware);
        return descriptor;
    }, sureIsArray(middleware));
}

export function log (target: any, name: string, value: PropertyDescriptor) {
    target[name] = sureIsArray(target[name]);
    target[name].splice(target[name].length - 1, 0, Logger);

    async function Logger(ctx: Koa.Context, next: any) {
        // The number of requests plus 1
        let currentRequestID = requestID++;

        // Request start time
        const startTime = process.hrtime();
        console.log(`→ (ID:${currentRequestID}) ${ctx.method} ${ctx.url}`);
        if((ctx.method).toLowerCase()  == 'post'){
            console.log(`→ (ID:${currentRequestID}) ${ctx.method} ${JSON.stringify(ctx.request.body)}`);
        }
        await next();

        // Return to the response end time
        const endTime = process.hrtime();
        // Calculate the total time of the process
        const elapsed = (endTime[0]-startTime[0]) * 1000 + (endTime[1]-startTime[1]) / 1000000;
        console.log(`← (ID:${currentRequestID}) ${ctx.method} ${ctx.url} : Status(${ctx.status}) Time(${elapsed.toFixed(0)}ms)`);
    }
    return value;
}

/**
 * Convert an array
 */
function sureIsArray (arr: any) {
    return Array.isArray(arr) ? arr : [arr];
}

/**
 * Whether the original value of the object to be modified
 * @param desc
 */
function isDescriptor (desc: PropertyDescriptor) {
    if (!desc || !desc.hasOwnProperty) return false;
    for (let key of ['value', 'initializer', 'get', 'set']) {
        if (desc.hasOwnProperty(key)) return true;
    }
    return false;
}

/**
 * Get the first element method
 */
function last (arr: Array<Function>) {
    return arr[arr.length -1];
}

/**
 * URL Must pass parameters check
 * @required({params: 'username'})
 * @required({params: ['username', 'age']})
 * @required({query: 'username'})
 */
function requireDescriptor (target: any, name: string, descriptor: PropertyDescriptor, rules: any) {
    target[name] = sureIsArray(target[name]);
    target[name].splice(target[name].length - 1, 0, middleware);
    return descriptor;

    async function middleware (ctx: Koa.Context, next: any) {
        if (rules.query) {
            rules.query = sureIsArray(rules.query);
            for (let name of rules.query) {
                if (!ctx.query[name]) ctx.throw(412, `GET Request query: ${name} required`);
            }
        }
        if (rules.params) {
            rules.params = sureIsArray(rules.params);
            for (let name of rules.params) {
                if (!ctx.params[name]) ctx.throw(412, `GET Request params: ${name} required`);
            }
        }
        await next();
    }
}

/**
 * Execute function
 */
function decorate (handleDescriptor: Function, entryArgs: Array<Function>) {
    if (isDescriptor(last(entryArgs))) return handleDescriptor(entryArgs);
    else return function () {
        return handleDescriptor(...arguments, ...entryArgs);
    }
}