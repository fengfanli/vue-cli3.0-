// 需求： @login & register
// 首先需要导入 express  获取router， 在进行路由指向
const express = require("express");
const router = express.Router();
// 导入POST 第三方模块  bcrypt
const bcrypt = require("bcrypt")
// 关于头像的 第三方库。   安装不上
// const gravatar = require('gravatar');
// 返回token，第三方库 jwt
const jwt = require('jsonwebtoken');
// 引入 passport
const passport = require("passport");

// 导入 用户 模型数据
const User = require("../../models/user");
// 导入配置文件
const keys = require("../../config/keys");


// @router  GET api/users/test
// @desc    返回的请求的json 数据
// @access  public
// router.get("/test", (req, res) =>{
//     res.json({
//         msg: "login work",
//     })
// })


// @router  POST api/users/register
// @desc    返回的请求的json 数据
// @access  public
// post 请求  就必须安装一个第三方模块： body-parser ：cnpm install body-parser。
router.post("/register", (req, res) => {
    // console.log(req.body);   //打印出 前台传递过来的 参数信息

    // 查询数据库中 是否拥有邮箱   引入用户模型数据
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                return res.status(400).json("邮箱已被占用");
            } else {
                // const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d:'mm' });  // s:大小，r：图片格式，d： 头像
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    // avatar,
                    password: req.body.password,
                    identity: req.body.identity
                });

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;

                        newUser.save()                                   // 保存数据到数据库。
                            .then(user => res.json(user))             // 返回到前端 打印出来。
                            .catch(err => console.log(err))           // 打印错误。
                    });
                });
            }
        })



})

// @router  POST api/users/login
// @desc    返回的  不是 请求的json 数据，而是 token jwt(json web token ) passport
// @access  public
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // 查询数据库
    User.findOne({ email })   // key value 都一样的 对象可以简写成一个。
        .then(user => {
            if (!user) {
                return res.status(404).json("用户不存在")
            }
            // 如果用户 存在的话，就要进行密码匹配
            // Load hash from your password DB.
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const rule = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar,
                            identity: user.identity
                        };
                        //   jwt.sign("规则", "加密名字", "过期时间"（3600为一个小时）, "箭头函数");
                        //   res.json({msg: "success"})
                        jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                            if (err) throw err;
                            res.json({
                                success: true,
                                // 固定写法        // 得到一个token值，接下来可以利用一个 token值 发送一些请求了。
                                token: "Bearer " + token
                            })
                        });
                    } else {
                        return res.status(400).json("密码错误");
                    }
                })
        })
});


// @router  GET api/users/current
// @desc    return scuurent user
// @access  private
// passport.authenticate("jwt", {session: false}) ：：为 passport 验证     // 要传递过去的验证方式：jwt，对象
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({
        id: req.user.id,            // passport.js 中，返回回来的 user 
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
    });

})


module.exports = router  // 需要暴露出去。 