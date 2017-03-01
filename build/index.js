"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const convert = require("koa-convert");
const BodyParser = require("koa-bodyparser");
const Json = require("koa-json");
const config_1 = require("./config");
const logger_1 = require("./middleware/logger");
const error_1 = require("./middleware/error");
const Route_1 = require("./middleware/router/Route");
const Database = require("./middleware/db");
const cors = require("koa-cors");
const app = new Koa();
const router = new Route_1.Route(app);
Database.init(config_1.default.get('mongo')['development']);
app.use(convert(Json()));
app.use(BodyParser());
app.use(error_1.default);
app.use(convert(cors({
    origin: true,
    credentials: true
})));
router.registerRouters(`${__dirname}/apis`);
app.on('error', (err, ctx) => {
    logger_1.default(ctx).error(err.message);
});
app.listen(config_1.default.get('port'), () => {
    console.log(`Server is running on port ${config_1.default.get('port')}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map