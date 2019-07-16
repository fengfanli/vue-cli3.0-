// 需求： 信息接口
// 首先需要导入 express  获取router， 在进行路由指向
const express = require("express");
const router = express.Router();
// 引入 passport
const passport = require("passport");

// 导入 用户 模型数据
const Profile = require("../../models/profile");

// @router  GET api/profiles/test
// @desc    返回的请求的json 数据
// @access  public
router.get("/test", (req, res) =>{
    res.json({
        msg: "profile work",
    })
})


// @router  POST api/profiles/add
// @desc    创建信息接口
// @access  public
router.post("/add", passport.authenticate("jwt", {session: false}), (req, res)=>{
    const profileFileds = {};
    if(req.body.type) profileFileds.type = req.body.type;
    if(req.body.describe) profileFileds.describe = req.body.describe;
    if(req.body.income) profileFileds.income = req.body.income;
    if(req.body.cash) profileFileds.cash = req.body.cash;
    if(req.body.expend) profileFileds.expend = req.body.expend;
    if(req.body.cash) profileFileds.cash = req.body.cash;
    if(req.body.remark) profileFileds.remark = req.body.remark;

    new Profile(profileFileds).save()
                              .then( profile => {
                                  res.json(profile);
                              })
});

// @router  GET api/profiles
// @desc    获取所有信息
// @access  private
router.get("/", passport.authenticate("jwt", {session: false}), (req, res) => {
    Profile.find()
           .then(profile => {
               if(!profile){
                   res.status(404).json("没有任何内容");
               }

               res.json(profile);
           })
           .catch(err => console.log(err));
});

// @router  GET api/profiles/:id
// @desc    获取单个信息
// @access  private
router.get(
    "/:id",                     //  获取传过来的Id  冒号 应该是占位符，表示是参数。
    passport.authenticate("jwt", {session: false}),
    (req, res) => {
        Profile.findOne({_id: req.params.id})
               .then(profile => {
                   if(!profile){
                       return res.status(404).json("没有任何内容");
                   }
                   res.json(profile);
               })
               .catch(err => res.status(404).json(err));
    }
);


// @router  POST api/profiles/edit/:id
// @desc    编辑信息接口
// @access  private
router.post(
    "/edit/:id",
    passport.authenticate("jwt", {session: false}),
    (req, res) => {
        const profileFileds = {};
        if(req.body.type) profileFileds.type = req.body.type;
        if(req.body.describe) profileFileds.describe = req.body.describe;
        if(req.body.income) profileFileds.income = req.body.income;
        if(req.body.cash) profileFileds.cash = req.body.cash;
        if(req.body.expend) profileFileds.expend = req.body.expend;
        if(req.body.cash) profileFileds.cash = req.body.cash;
        if(req.body.remark) profileFileds.remark = req.body.remark;

        Profile.findOneAndUpdate(
            {_id: req.params.id},
            {$set: profileFileds},
            {new: true}
        ).then(profile => res.json(profile));
    }
);

// @router  DELETE api/profiles/delete/:id
// @desc    删除信息接口
// @access  private
router.delete(
    "/delete/:id",
    passport.authenticate("jwt", {session: false}),
    (req ,res) => {
        Profile.findOneAndRemove({_id: req.params.id})
               .then(profile => {
                   res.json(profile);
               })
               .catch(err => res.status(404).json("删除失败"));
    }
);


module.exports = router  // 需要暴露出去。 