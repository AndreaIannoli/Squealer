const mongoose = require("mongoose");
const {mongo} = require("mongoose");


const charactersSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    number:{
        type : String,
        required : true,
        default : "",

    }
});


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
    },
    channelsIds:{
        type: [String],
        required: true,
        default: [],
    },
    characters: {
        type: [charactersSchema],
        required: true,
        default: [],
    },
    admin:{
        type: Boolean,
        required: true,
        default: false
    },
    blocked:{
        type: Boolean,
        required: true,
        default: false
    }
});

const reactionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    usersIds:{
        type: [String],
        required: true,
        default: [],
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
    },
    geolocation:{
        type: [String],
        default: [],
    },
    img:{
        type: String,
        maxlength: 16777216,
        default: "",
    },
    date:{
        type: Date,
        default: "",
    },
    resqueal:{
        type: String,
        default: ""
    },
    reactions:{
        type: [reactionSchema],
        default: [],
    },
    CM:{
        type: String,
        default: "",
    },
    linkRss:{
        type: [String],
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
        default: [],
    },
    notificationsIds:{
        type: [String],
        default: [],
    },
});

const channelSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    owners:{
        type: [String],
        required: true,
        default: [],
    },
    channelType:{
        type: String,
        required: true,
        default: "user",
    },
    access:{
        type: String,
        required: true,
        default: "public",
    },
    writers: {
        type: [String],
        required: true,
        default: []
    },
    writingRestriction: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        default: ''
    }
});

const notificationSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        default: 'Notification'
    },
    date:{
        type: Date,
        required: true,
        default: new Date()
    },
    text:{
        type: String,
        required: true,
        default: ''
    },
    sender:{
        type: String,
        required: true
    }
});

const User = mongoose.model("User", userSchema);
const Squeal = mongoose.model("Squeal", squealSchema);
const Inbox = mongoose.model("Inbox", inboxSchema);
const Channel = mongoose.model("Channel", channelSchema);
const Notification = mongoose.model("Notification", notificationSchema);
const Reaction = mongoose.model("Reaction", reactionSchema);
const Characters = mongoose.model("Characters", charactersSchema);

exports.userModel = User;
exports.squealModel = Squeal;
exports.inboxModel = Inbox;
exports.channelModel = Channel;
exports.notificationModel = Notification;
exports.reactionModel = Reaction;

exports.charactersSchema = Characters;
