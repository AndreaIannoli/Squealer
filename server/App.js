const config = require('./Config');
const express = require('express');
const mongoose = require('mongoose');
const userModel = require("./models");
const app = express ();
app.use(express.json());
const PORT = config.getPort();

mongoose.connect('mongodb://localhost:27017/Squealer');

app.get('/status', (request, response) => {
    const status = {
          'Status': 'Running'
    };

    response.send(status);
});

app.post("/add_user", async (request, response) => {
    const user = new userModel(request.body);

    try {
        await user.save();
        response.send(user);
    } catch (error) {
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

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});