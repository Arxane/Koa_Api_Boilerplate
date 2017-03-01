'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const index_1 = require("./../model/user/index");
const mongoose_1 = require("mongoose");
function init(config) {
    Mongoose.Promise = mongoose_1.Promise;
    Mongoose.connect(config.host);
    let mongoDb = Mongoose.connection;
    mongoDb.on('error', () => {
        console.log(`Unable to connect to database: ${config.host}`);
    });
    mongoDb.once('open', () => {
        console.log(`Connected to database: ${config.host}`);
    });
    return {
        userModel: index_1.UserModel
    };
}
exports.init = init;
//# sourceMappingURL=db.js.map