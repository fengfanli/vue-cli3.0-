// 构建服务器  导入express 模块
const express = require("express");
// 导入mongoose
const mongoose = require("mongoose");
// 导入 bady-parser
const bodyParser = require("body-parser");
// 导入 第三方插件，passport 和 passport-jwt
const passport = require("passport");
const app = express();

// 引入 user.js profile.js
const users = require("./routes/api/users");  // 引入之后，还需要使用中间件来使用我们的 router。放到端口之上：
const profiles = require("./routes/api/profiles");

// 链接数据库，使用一个专用的JS文件。新建一个文件夹config ，新建一个文件 keys.js
// DB config
const db = require("./config/keys").mongoURI;

// 使用 body-parser 的中间件   请求方式为 POST ，就必须使用 第三方的模块
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// passport 初始化
app.use(passport.initialize());
// 把上面的 引入的 passport 作为参数传到 js文件 passport.js 中去，这样就在 ./config/passport.js 中编写关于passport的 内容，实现了模块的分离 
require("./config/passport")(passport); 

// Connect to mongodb
mongoose.connect(db, { useNewUrlParser: true })
        .then(() => console.log(" MongoDB Connected"))
        .catch(err => console.log(err));


// app.get("/", (req, res)=>{
//     res.send("HELLO WORLD");
// })

app.use("/api/users", users);
app.use("/api/profiles", profiles);

const port = process.env.PORT || 5000;
app.listen(port, ()=> {
    console.log(`Server running on port ${ port }`);
})
// 目前为止，服务器创建成功。使用  node server.js  运行成功。

// mongo 创建完，需要使用mongoose，新建一个base，安装mongoose ：cnpm install mongoose