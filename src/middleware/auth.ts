'use strict';
import config from '../config';
const jwt = require('jsonwebtoken');

export function signToken(id: string) {
  return jwt.sign({_id: id}, config.get('session').secrets, {'expiresIn': '1d' });
}
