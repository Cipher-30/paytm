const mongoose = require("mongoose");


const AccountSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User",

    },
    balance: {
        type: Number,
        require:true,
        trim: true
    }
})


module.exports = mongoose.model("Account", AccountSchema );