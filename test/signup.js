/**
 * Created by Administrator on 2016/11/28.
 */
var path = require('path');
var assert = require('assert');
var request = require('supertest');
var app = require('../index');
var User = require('../lib/mongo').User;


describe('signup', function () {
    var agent = request.agent(app);//persist cookie when redirect
    beforeEach(function (done) {
        //创建一个用户
        User.create({
            name:'aaa',
            passwordx:'123456',
            avatar:'',
            gender:'x',
            bio:''
        })
            .exec()
            .then(function () {
                done();
            })
            .catch(done);
    });

    it('wrong gender', function (done) {
        agent.post('/signup')
            .type('form')
            .attach('avatar', path.join(__dirname, 'avatar.png'))
            .field({name:'nswbmw', gender:'a'})
            .redirects()
            .end(function (err, res) {
                assert(res.text.match(/性别只能是m、f或x/));
                done();
            })
    });

    //其余的参数测试自动补全
    //用户民被占用的情况
    it('duplicate', function (done) {
        agent.post('/signup')
            .type('form')
            .attach('avatar', path.join(__dirname, 'avatar.png'))
            .field({ name: 'aaa', gender: 'm', bio: 'noder', password: '123456', repassword: '123456' })
            .redirects()
            .end(function(err, res) {
                if (err) return done(err);
                assert(res.text.match(/用户名已被占用/));
                done();
            });
    });


    // 注册成功的情况
    it('success', function(done) {
        agent
            .post('/signup')
            .type('form')
            .attach('avatar', path.join(__dirname, 'avatar.png'))
            .field({ name: 'nswbmw', gender: 'm', bio: 'noder', password: '123456', repassword: '123456' })
            .redirects()
            .end(function(err, res) {
                if (err) return done(err);
                assert(res.text.match(/注册成功/));
                done();
            });
    });


});