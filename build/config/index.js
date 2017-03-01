'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const nconf = require("nconf");
const path = require("path");
const obj = {};
if (!obj.config) {
    obj.config = nconf.argv().env().file({ file: 'config.json' });
}
let config = obj.config;
config.set('root', path.join(__dirname, '../'));
exports.default = config;
//# sourceMappingURL=index.js.map