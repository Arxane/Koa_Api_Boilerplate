const expect = require('chai');
const request = require('supertest');

describe('Users', function () {
    let host = "localhost:8083";
    it('Should register user on /user/register POST', function(done){
        request(host)
            .post('/user/register')
            .type('form')
            .send({ username: 'zhangsan' })
            .send({ password: '123456' })
            .send({ email: '123456@163.com' })
            .expect(200, done);
    });
});