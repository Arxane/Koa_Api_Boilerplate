'use strict';
import * as Mongoose from "mongoose";
import { IUser, UserModel } from './../model/user/index';
import {Promise} from "mongoose";

export interface DbConfig {
    host: string,
    user ?: string,
    password ?: string
}

export interface Database {
    userModel: Mongoose.Model<IUser>;
}

export function init(config: DbConfig): Database {
    (<any>Mongoose).Promise = Promise;
    Mongoose.connect(config.host);

    let mongoDb = Mongoose.connection;
    mongoDb.on('error', () => {
        console.log(`Unable to connect to database: ${config.host}`);
    });
    mongoDb.once('open', () => {
        console.log(`Connected to database: ${config.host}`);
    });

    return {
        userModel: UserModel
    }
}