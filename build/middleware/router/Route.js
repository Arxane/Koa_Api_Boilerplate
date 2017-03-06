'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const glob = require("glob");
const path = require("path");
const jwt = require("koa-jwt");
const router = new Router();
exports.symbolRoutePrefix = Symbol("routePrefix");
class Route {
    constructor(app) {
        this.app = app;
        this.router = router;
    }
    registerRouters(controllerDir, secrets) {
        glob.sync(path.join(controllerDir, './*.js')).forEach((item) => require(item));
        let unlessPath = [];
        for (let [config, controller] of Route.__DecoratedRouters) {
            let controllers = Array.isArray(controller) ? controller : [controller];
            let prefixPath = config.target[exports.symbolRoutePrefix];
            if (prefixPath && (!prefixPath.startsWith('/'))) {
                prefixPath = '/' + prefixPath;
            }
            let routerPath = prefixPath + config.path;
            if (config.unless) {
                unlessPath.push(routerPath);
            }
            controllers.forEach((controller) => this.router[config.method](routerPath, controller));
        }
        this.app.use(jwt({ secret: secrets }).unless({ path: unlessPath }));
        this.app.use(this.router.routes());
        this.app.use(this.router.allowedMethods());
    }
}
Route.__DecoratedRouters = new Map();
exports.Route = Route;
//# sourceMappingURL=Route.js.map