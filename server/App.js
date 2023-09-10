const config = require('./Config');
const express = require('express');
const mongoose = require('mongoose');
const { userModel, squealModel, inboxModel, channelModel} = require("./models");
const bodyParser = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const app = express ();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());
const https = require('https');
const PORT = config.getPort();
const options = {
    key: fs.readFileSync(process.env.PATH_TO_CERTIFICATE_KEY),
    cert: fs.readFileSync(process.env.PATH_TO_CERTIFICATE)
};
const server = https.createServer(options, app);
const crypto = require('crypto');
const secretKey = config.getKey();
const cookieParser = require('cookie-parser');
const cors = require('cors');

mongoose.connect('mongodb://localhost:27017/Squealer');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(
    cors({
        origin: 'https://localhost:3000', // Replace with the actual origin of your client app
        credentials: true, // Allow credentials (e.g., cookies) to be sent
    })
);

app.use(cookieParser());

app.get('/status', (request, response) => {
    const status = {
          'Status': 'Running'
    };

    response.send(status);
});

app.post("/register_user", async (request, response) => {
    try {
        request.body["password"] = encrypt(request.body["password"]);
        const user = new userModel(request.body);
        await user.save();
        const token = jwt.sign({ username: request.body['username'] , id: user['_id'] }, secretKey,{});
        response.cookie('jwt', token, { httpOnly: true, secure: true });
        response.cookie('loggedStatus', 'logged', { httpOnly: false, secure: false });
        response.json({
            result: 'successful',
        });
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.post("/authenticate_user", async (request, response) => {
    try {
        const user = await userModel.findOne({username: request.body['username']});
        if(request.body['password'] === decrypt(user['password'])) {
            const token = jwt.sign({ username: request.body['username'], id: user['_id'] }, secretKey,{});
            response.cookie('jwt', token, { httpOnly: true, secure: true });
            response.cookie('loggedStatus', 'logged', { httpOnly: false, secure: false });
            response.json({
                userPropic: user.propic,
                result: 'successful',
            });
        } else {
            response.json({
                result: 'failed',
            });
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/existence_user", async (request, response) => {
    try {
        if(await userModel.findOne({ username: request.query.username })) {
            response.send('exist');
        } else {
            response.send('notExist');
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/propic_user", async (request, response) => {
    try {
        const user = await userModel.findOne({ username: request.query.username }, { propic: true, _id: false });
        if(user) {
            response.send(user.propic);
        } else {
            response.send('user doesn\'t exist');
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/search", async (request, response) => {
    try {
        const substringToSearch = request.query.value; // Replace with the substring you want to search for
        const resultUsernames = await userModel.find({ username: { $regex: new RegExp(substringToSearch), $options: 'i' } }, { _id: false, username: true });
        const usernames = resultUsernames.map(user => '@' + user.username);
        const resultChannels = await channelModel.find({ name: { $regex: new RegExp(substringToSearch), $options: 'i' } }, { _id: false, name: true });
        const channels = resultChannels.map(channel => '#' + channel.name);
        let results = usernames.concat(channels);
        response.send(results);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.get("/search_user", async (request, response) => {
    try {
        const substringToSearch = request.query.value; // Replace with the substring you want to search for
        const resultUsernames = await userModel.find({ username: { $regex: new RegExp(substringToSearch), $options: 'i' } }, { _id: false, username: true });
        const usernames = resultUsernames.map(user => '@' + user.username);
        response.send(usernames);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.get("/search_channel", async (request, response) => {
    try {
        const substringToSearch = request.query.value; // Replace with the substring you want to search for
        const resultChannels = await channelModel.find({ name: { $regex: new RegExp(substringToSearch), $options: 'i' } }, { _id: false, name: true });
        const channels = resultChannels.map(channel => '#' + channel.name);
        response.send(channels);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.get("/users", async (request, response) => {
    const users = await userModel.find({});

    try {
        response.send(users);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/channels_squeals", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.json({
                result: "authentication failed"
            })
            return;
        }

        const user = await userModel.findOne({username: username}, {channelsIds: true, _id: false});
        if(user) {
            const channelsIds = user.channelsIds;
            let squeals = [];
            for(let channelId of channelsIds) {
                const channel = await channelModel.findOne({_id: channelId}, {name: true, _id: false});
                const inbox = await inboxModel.findOne({receiver: '#' + channel.name}, {squealsIds: true, _id: false});
                if(inbox === null){
                    continue;
                }
                const squealsIds = inbox.squealsIds;
                for(let squealId of squealsIds) {
                    let squeal = await squealModel.findOne({_id: squealId});
                    squeal = {
                        id: squeal._id.toHexString(),
                        from: '#' + channel.name,
                        sender: squeal.sender,
                        text: squeal.text,
                        date: squeal.date
                    }
                    squeals.push(squeal);
                }
            }
            squeals.sort(compareSquealsDate);
            response.send(squeals);
        }
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.get("/private_squeals", async (request, response) => {
    try {
        let username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.json({
                result: "authentication failed"
            })
            return;
        }
        username = '@' + username;

        const inbox = await inboxModel.findOne({receiver: username}, {squealsIds: true, _id: false});
        if(inbox) {
            const squealsIds = inbox.squealsIds;
            let squeals = [];
            for(let squealId of squealsIds) {
                const squeal = await squealModel.findOne({_id: squealId});
                squeals.push(squeal);
            }
            squeals.sort(compareSquealsDate);
            response.send(squeals);
        }
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.post("/post_squeal", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.json({
                result: "authentication failed"
            });
            return;
        }
        request.body['sender'] = username;
        const squeal = new squealModel({
            sender: request.body.sender,
            text: request.body.text,
            date: new Date()
        });
        const newSqueal = await squeal.save();
        const receiversArr = request.body.receivers;
        for(let receiverUsername of receiversArr){
            if (await inboxModel.findOne({ receiver: receiverUsername })) {
                await inboxModel.findOneAndUpdate(
                    {receiver: receiverUsername}, // Query condition to find the document
                    {$push: {squealsIds: newSqueal._id.toHexString()}}, // Update operation to push the new string
                    {new: true}, // Option to return the updated document
                );
            } else {
                const inbox = new inboxModel({
                    receiver: receiverUsername,
                    squealsIds: [newSqueal._id.toHexString()],
                })
                await inbox.save();
            }
        }

        response.json({
            result: "successful"
        });
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.get("/existence_channel", async (request, response) => {
    try {
        if(await channelModel.findOne({ name: request.query.name })) {
            response.send('exist');
        } else {
            response.send('notExist');
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

app.post("/create_channel", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.json({
                result: "authentication failed"
            });
            return;
        }

        if ((await channelModel.findOne({name: request.body.name}, {_id: true})) === null){
            const channel = new channelModel({
                name: request.body.name,
                description: request.body.description,
                owners: [username],
            });
            const newChannel = await channel.save();
            await userModel.findOneAndUpdate(
                {username: username},
                {$push: {channelsIds: newChannel._id.toHexString()}},
                {new: true},
            );

            response.json({
                result: "successful"
            });
        } else {
            console.log(await channelModel.findOne({name: request.body.name}, {_id: true}));
            response.json({
                result: "channel already exists"
            });
            return;
        }
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.post("/subscribe_channel", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.json({
                result: "authentication failed"
            })
            return;
        }

        const channel = await channelModel.findOne({name: request.body.name}, {_id: true});
        if (channel !== null){
            await userModel.findOneAndUpdate(
                {username: username}, // Query condition to find the document
                {$push: {channelsIds: channel._id.toHexString()}}, // Update operation to push the new string
                {new: true}, // Option to return the updated document
            );

            response.json({
                result: "successful"
            });
        } else {
            response.json({
                result: "channel doesn't exist"
            });
            return;
        }
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

server.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

// Encrypt data
function encrypt(text) {
    const iv = crypto.randomBytes(16); // Generate a random IV (Initialization Vector)
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + encrypted;
}

// Decrypt data
function decrypt(encryptedText) {
    const iv = Buffer.from(encryptedText.slice(0, 32), 'hex'); // Extract the IV from the encrypted data
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
    encryptedText = encryptedText.slice(32); // Remove the IV from the encrypted data
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

async function authenticateUser(request) {
    if(!request.cookies.loggedStatus){
        console.log('sloggato');
        return false;
    }
    const token = jwt.verify(request.cookies.jwt, secretKey);
    const user = await userModel.findOne({username: token.username}, {username: true, _id: true});
    if(user != null && user._id.toHexString() === token.id){
        return token.username;
    } else {
        return false;
    }
}

function compareSquealsDate(a, b){
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if(dateA - dateB > 0){
        return -1;
    } else if(dateA - dateB < 0) {
        return 1;
    } else {
        return 0;
    }
}