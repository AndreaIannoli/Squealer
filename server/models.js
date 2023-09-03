const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    propic: {
        type: String,
        maxlength: 16777216,
    }
});

const squealSchema = new mongoose.Schema({
    sender:{
        type:String,
        required: true,
    },
    text:{
        type: String,
        default: "",
    }
});

const inboxSchema = new mongoose.Schema({
    receiver:{
        type:String,
        required: true,
    },
    squealsIds:{
        type: [String],
        required: true,
        default: [],
    }
});

const User = mongoose.model("User", userSchema);
const Squeal = mongoose.model("Squeal", squealSchema);
const Inbox = mongoose.model("Inbox", inboxSchema);

exports.userModel = User;
exports.squealModel = Squeal;
exports.inboxModel = Inbox;