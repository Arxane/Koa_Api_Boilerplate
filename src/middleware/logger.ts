'use strict';
import * as Koa from 'Koa';
import * as bunyan from 'bunyan';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import config from '../config';

const log_path = config.get('root') + config.get("log")['log_path'];

// Generate log directory
mkdirp.sync(log_path);

// Determines whether the log object exists
const obj:any = {};
if(!obj.log) {
    obj.log = bunyan.createLogger({
        name: config.get("log")['log_name'],
        serializers: {
            req: reqSerializer,
            res: bunyan.stdSerializers.res,
            err: bunyan.stdSerializers.err
        },
        streams: [
            {
                level: 'info',
                stream: process.stdout
            },
            {
                type: 'rotating-file',
                level: 'error',
                path: log_path + config.get("log")['log_name'] + '-' + 'error.log',
                period: '1d',   // Daily rotation
                count: 7        // Keep 7 back copies
            }
        ]
    });
}

// Request serialization
function reqSerializer(ctx: Koa.Context) {
    return {
        method: ctx.method,
        url: ctx.url,
        headers: ctx.headers,
        ip: ctx.headers['x-forwarded-for'] || ctx.ip || ctx.ips
    };
}

// Set the log child process, encapsulate req
function logChild(ctx: Koa.Context) {
    let log = obj.log;
    return log.child({req: ctx});
}

export default logChild;