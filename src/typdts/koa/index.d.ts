/**
 * Koa-router adds parameters to the koa ctx object
 * This code appends a params field to the interface
 */
import * as Koa from "koa";
import * as compose from 'koa-compose';

declare module "koa" {
    interface Context {
        ip: any;
        params: any;
        otherArgs: any;
    }
}