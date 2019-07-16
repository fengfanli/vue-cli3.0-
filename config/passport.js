const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;

const mongoose = require("mongoose");
const User = mongoose.model("users");   // 引入 mongo的原因是要把用户的模型引进来，在 models/user.js 最下面的 users。。。
const keys = require("../config/keys"); 


const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

// 接收到 传过来的 参数  passport。
module.exports = passport =>{
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        // console.log(jwt_payload);    // 打印成功，打印出了对应的用户对象信息
        User.findById(jwt_payload.id)
            .then(user => {
                if(user){
                    return done(null, user);        // 将 user 返回回去。
                }
                return done(null, false);
            }).catch(err => console.log(err));
    }));
}