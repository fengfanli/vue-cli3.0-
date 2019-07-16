// 数据存储的 模型
const mongoose = require("mongoose");
const Schmea = mongoose.Schema;

// Create Scheme
const UserSchema = new Schmea({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    avator: {
        type: String,

    },
    identity: { //身份，
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
})

module.exports = User = mongoose.model("users",UserSchema);