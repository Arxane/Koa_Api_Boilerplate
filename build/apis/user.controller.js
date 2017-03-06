'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const Koa = require("koa");
const router_1 = require("../middleware/router");
const auth_1 = require("../middleware/auth");
const UserModel = Mongoose.model('User');
function someFun(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('convert function');
        yield next();
    });
}
let UserController = class UserController {
    getUserOne(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield UserModel.findOne({ username: ctx.params.username });
            ctx.body = user;
        });
    }
    getUserList(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let userList = yield UserModel.find();
            ctx.body = userList;
        });
    }
    saveUser(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let _user = ctx.request.body;
            let newUser = new UserModel(_user);
            let user = yield newUser.save();
            ctx.body = {
                token: auth_1.signToken(user.id),
                username: user.username
            };
        });
    }
    loginUser(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let _user = ctx.request.body;
        });
    }
};
__decorate([
    router_1.router({
        method: 'get',
        path: '/findOne/:username'
    }),
    router_1.required({ params: 'username' }),
    router_1.log,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserOne", null);
__decorate([
    router_1.router({
        method: 'get',
        path: '/list'
    }),
    router_1.convert(someFun),
    router_1.log,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserList", null);
__decorate([
    router_1.router({
        method: 'post',
        path: '/register',
        unless: true
    }),
    router_1.log,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "saveUser", null);
__decorate([
    router_1.router({
        method: 'post',
        path: '/login',
        unless: true
    }),
    router_1.log,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "loginUser", null);
UserController = __decorate([
    router_1.prefix('/user')
], UserController);
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map