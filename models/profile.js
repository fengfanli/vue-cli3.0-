// 数据存储的 模型
const mongoose = require("mongoose");
const Schmea = mongoose.Schema;

// Create Scheme
const ProfileSchema = new Schmea({
    type: { 
        type: String,
    },
    describe: { 
        type: String,
    },
    income: { 
        type: String,
    },
    expend: { 
        type: String,
    },
    cash: { 
        type: String,
    },
    remark: { 
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
})

module.exports = Profile = mongoose.model("profile",ProfileSchema);