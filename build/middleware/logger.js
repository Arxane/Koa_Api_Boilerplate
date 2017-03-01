'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require("bunyan");
const mkdirp = require("mkdirp");
const config_1 = require("../config");
const log_path = config_1.default.get('root') + config_1.default.get("log")['log_path'];
mkdirp.sync(log_path);
const obj = {};
if (!obj.log) {
    obj.log = bunyan.createLogger({
        name: config_1.default.get("log")['log_name'],
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
                path: log_path + config_1.default.get("log")['log_name'] + '-' + 'error.log',
                period: '1d',
                count: 7
            }
        ]
    });
}
function reqSerializer(ctx) {
    return {
        method: ctx.method,
        url: ctx.url,
        headers: ctx.headers,
        ip: ctx.headers['x-forwarded-for'] || ctx.ip || ctx.ips
    };
}
function logChild(ctx) {
    let log = obj.log;
    return log.child({ req: ctx });
}
exports.default = logChild;
//# sourceMappingURL=logger.js.map