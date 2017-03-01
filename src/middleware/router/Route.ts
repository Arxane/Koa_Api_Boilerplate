'use strict';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as glob from 'glob';
import * as path from "path";

const router = new Router();

// Define a constant field that is read when used
export const symbolRoutePrefix:symbol = Symbol("routePrefix");


/**
 * Routing execution class
 * The entry file is loaded
 * const route = new Route(ctx: Koa);
 *
 * @class Route
 */
export class Route {
    // Static storage of the modified route
    static __DecoratedRouters: Map<{target: any, method: string, path: string}, Function | Function[]> = new Map();
    private router: any;
    private app: Koa;

    /**
     * Creates an instance of Route.
     *
     * @param {Koa} app
     *
     * @memberOf Route
     */
    constructor(app: Koa) {
        this.app = app;
        this.router = router;
    }

    /**
     * Register the route
     * new Route(ctx:Koa).registerRouters(apipath);
     *
     * @param {String} controllerDir
     *
     * @memberOf Route
     */
    registerRouters(controllerDir: string) {
        // Load the api interface and use sync to load
        glob.sync(path.join(controllerDir, './*.js')).forEach((item)=>require(item));
        // Configure routing
        for(let [config, controller] of Route.__DecoratedRouters) {
            let controllers = Array.isArray(controller) ? controller : [controller];
            let prefixPath = config.target[symbolRoutePrefix];
            if(prefixPath && (!prefixPath.startsWith('/'))) {
                prefixPath = '/' + prefixPath;
            }
            // Splicing api routing
            let routerPath = prefixPath + config.path;
            controllers.forEach((controller) => this.router[config.method](routerPath, controller));
        }
        this.app.use(this.router.routes());
        this.app.use(this.router.allowedMethods());
    }
}