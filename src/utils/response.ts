import * as Koa from 'koa';

/**
 * @export
 * @param {Koa.Context} ctx
 * @param {Number} status
 * @param {any} data
 */
export interface Response {
  msg?: string;
  data?: any
}

export function response(ctx: Koa.Context, status: Number = 200, result: Response) {
  ctx.body = {
    status: status,
    result: result
  }
}