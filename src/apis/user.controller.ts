'use strict'
import * as Mongoose from "mongoose";
import * as Koa from 'koa';
import {router, required, prefix, convert, log} from '../middleware/router';
import {signToken} from '../middleware/auth';
const UserModel = Mongoose.model('User');

//Middleware test
async function someFun (ctx: Koa.Context, next: any) {
    console.log('convert function');
    await next();
}

@prefix('/user')
class UserController {

    //http://localhost:8083/user/findOne/test
    @router({
        method: 'get',
        path: '/findOne/:username'
    })
    @required({params: 'username'})
    @log
    async getUserOne (ctx: Koa.Context): Promise<void> {
        let user = await UserModel.findOne({username: ctx.params.username});
        ctx.body = user;
    }

    //http://localhost:8083/user/list
    @router({
        method: 'get',
        path: '/list'
    })
    @convert(someFun)
    @log
    async getUserList (ctx: Koa.Context): Promise<void> {
        let userList = await UserModel.find();
        ctx.body = userList;
    }

    //http://localhost:8083/user/register
    @router({
        method: 'post',
        path: '/register',
        unless: true
    })
    @log
    async saveUser (ctx: Koa.Context): Promise<void> {
        let _user = ctx.request.body;
        // Instantiate a new user model
        let newUser = new UserModel(_user);
        // Storage
        let user:any = await newUser.save();
        ctx.body = {
            token: signToken(user.id),
            username: user.username
        };
    }

    @router({
        method: 'post',
        path: '/login',
        unless: true
    })
    @log
    async loginUser (ctx: Koa.Context): Promise<void> {
        let _user = ctx.request.body;
    }

}

export default UserController;