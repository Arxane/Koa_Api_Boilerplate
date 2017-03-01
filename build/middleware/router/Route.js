'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const glob = require("glob");
const path = require("path");
const router = new Router();
exports.symbolRoutePrefix = Symbol("routePrefix");
class Route {
    constructor(app) {
        this.app = app;
        this.router = router;
    }
    registerRouters(controllerDir) {
        glob.sync(path.join(controllerDir, './*.js')).forEach((item) => require(item));
        for (let [config, controller] of Route.__DecoratedRouters) {
            let controllers = Array.isArray(controller) ? controller : [controller];
            let prefixPath = config.target[exports.symbolRoutePrefix];
            if (prefixPath && (!prefixPath.startsWith('/'))) {
                prefixPath = '/' + prefixPath;
            }
            let routerPath = prefixPath + config.path;
            controllers.forEach((controller) => this.router[config.method](routerPath, controller));
        }
        this.app.use(this.router.routes());
        this.app.use(this.router.allowedMethods());
    }
}
Route.__DecoratedRouters = new Map();
exports.Route = Route;
//# sourceMappingURL=Route.js.map