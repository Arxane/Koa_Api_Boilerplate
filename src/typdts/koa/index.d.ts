/**
 * Koa-router adds parameters to the koa ctx object
 * This code appends a params field to the interface
 */
import * as Koa from "koa";

declare module "koa" {
    interface Context {
        params: any; //koa-router
        ip: any;
    }
}