const config = require('./Config');
const express = require('express');
const mongoose = require('mongoose');
const { userModel, squealModel, inboxModel, channelModel, notificationModel, reactionModel, charactersSchema} = require("./models");
const bodyParser = require("express");
const jwt = require("jsonwebtoken");
const cronJob = require("node-cron");
const fs = require("fs");
const { createCanvas, loadImage } = require('canvas')
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
const {json} = require("express/lib/response");

const Parser = require('rss-parser');
const parser = new Parser();
const axios = require('axios');
const {Buffer} = require("buffer");
const parseString = require('xml2js').parseString;


mongoose.connect('mongodb://127.0.0.1:27017/Squealer');

async function checkChannelALL() {
    const squealerAll = await channelModel.findOne({name: 'ALL'});
    if (!squealerAll) {
        const channel = new channelModel({
            name: 'ALL',
            description: 'A generic channel used by the staff',
            channelType: 'squealer'
        });
        await channel.save();
        const inbox = new inboxModel({
            receiver: '§ALL'
        });
        await inbox.save();
        console.log('Squealer channel ALL created successfully')
    }
}
checkChannelALL();

async function checkChannelNews() {
    const squealerNews = await channelModel.findOne({name: 'NEWS'});
    if(!squealerNews) {
        const channel = new channelModel({
            name: 'NEWS',
            description: 'A channel with all the news from the NY Times',
            channelType: 'squealer'
        });
        await channel.save();
        const inbox = new inboxModel({
            receiver: '§NEWS'
        });
        await inbox.save();
        console.log('Squealer channel NEWS created successfully');
        const nyTimes = await userModel.findOne({username: 'NYTimes'});
        if(!nyTimes) {
            const user = new userModel({
                name: 'NY',
                surname: 'Times',
                email: 'nytnews@nytimes.com',
                username: 'NYTimes',
                password: 'admin',
                propic: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fhelp.nytimes.com%2Fhc%2Fen-us%2Farticles%2F115014891408-Obtaining-and-using-Times-content&psig=AOvVaw2XDKBNB4cSI6wtVgA6SZkB&ust=1697469040010000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCPCCg4ur-IEDFQAAAAAdAAAAABAJ'
            });
            await user.save();
            const inboxNYT = await inboxModel.findOne({receiver: '§NYTimes'});
            if(!inboxNYT) {
                const inbox = new inboxModel({
                    receiver: '@NYTimes'
                });
                await inbox.save();
            }
            console.log('Squealer user NYTimes created successfully');
        }
    }
}
checkChannelNews()

async function checkChannelControversial() {
    const squealerControversial = await channelModel.findOne({name: 'CONTROVERSIAL'});
    if(!squealerControversial) {
        const channel = new channelModel({
            name: 'CONTROVERSIAL',
            description: 'A channel with all the controversial squeal',
            channelType: 'squealer'
        });
        await channel.save();
        const inbox = new inboxModel({
            receiver: '§CONTROVERSIAL'
        });
        await inbox.save();
        console.log('Squealer channel CONTROVERSIAL created successfully');
    }
}
checkChannelControversial();

async function checkChannelIMG() {
    const squealerImg = await channelModel.findOne({name: 'RANDOMIMG'});
    if(!squealerImg) {
        const channel = new channelModel({
            name: 'RANDOMIMG',
            description: 'A channel with random image picked from an api called Lorem Picsum',
            channelType: 'squealer'
        });
        await channel.save();
        const inbox = new inboxModel({
            receiver: '§RANDOMIMG'
        });
        await inbox.save();
        console.log('Squealer channel RANDOMIMG created successfully');
        const loremPicsum = await userModel.findOne({username: 'LoremPicsum'});
        if(!loremPicsum) {
            const user = new userModel({
                name: 'Lorem',
                surname: 'Picsum',
                email: 'lorem@picsum.com',
                username: 'LoremPicsum',
                password: 'admin',
                propic: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpicsum.photos%2F&psig=AOvVaw3_pg0qugMb6aIuf8_s8hil&ust=1697470177425000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCODA-qmv-IEDFQAAAAAdAAAAABAE'
            });
            await user.save();
            const inboxPicsum = await inboxModel.findOne({receiver: '§LoremPicsum'});
            if(!inboxPicsum) {
                const inbox = new inboxModel({
                    receiver: '@LoremPicsum'
                });
                await inbox.save();
            }
            console.log('Squealer user LoremPicsum created successfully');
        }
    }
}
checkChannelIMG();

async function checkChannelWeather() {
    const squealerWeather = await channelModel.findOne({name: 'WEATHERBOLO'});
    if(!squealerWeather) {
        const channel = new channelModel({
            name: 'WEATHERBOLO',
            description: 'A channel with all the weather forecast by Open Weather',
            channelType: 'squealer'
        });
        await channel.save();
        const inbox = new inboxModel({
            receiver: '§WEATHERBOLO'
        });
        await inbox.save();
        console.log('Squealer channel WEATHERBOLO created successfully');
        const openWeather = await userModel.findOne({username: 'OpenWeather'});
        if(!openWeather) {
            const user = new userModel({
                name: 'Open',
                surname: 'Weather',
                email: 'open@weather.com',
                username: 'OpenWeather',
                password: 'admin',
                propic: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fopenweathermap.org%2Fweather-conditions&psig=AOvVaw0-wTVhWYVZIA_Mw0KemgZb&ust=1697471809930000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCODr67O1-IEDFQAAAAAdAAAAABAF'
            });
            await user.save();
            const inboxWeather = await inboxModel.findOne({receiver: '§OpenWeather'});
            if(!inboxWeather) {
                const inbox = new inboxModel({
                    receiver: '@OpenWeather'
                });
                await inbox.save();
            }
            console.log('Squealer user OpenWeather created successfully');
        }
    }
}
checkChannelWeather();


// Imposta l'URL dell'API di destinazione
const apiDestinazione = 'URL_Dell_API_Di_Destinazione';
async function getRss(){
    return await axios.get(`https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml`)
        .then((response) => {
            const feed = response.data;
            //console.log(feed);
            const xmlData = response.data;
            // Converti l'XML in JSON
            parseString(xmlData, async (error, result) => {
                if (error) {
                    console.error('Errore nella conversione da XML a JSON', error);
                } else {
                    const jsonData = result; // Contiene il feed RSS convertito in oggetti JSON
                    // Accedi ai diversi elementi del feed RSS
                    const rss = jsonData.rss.channel[0]; // Canale RSS
                    // controllo il primo item se è esistente lo aggiungo alla lista e lo metto nel db
                    // altrimenti passo avanti
                    console.log(rss.item.length)
                    const nycTimes = await userModel.findOne({username: 'NYTimes'});

                    for (let index = 0; index < rss.item.length; index++) {

                        param1 = rss.item[index].link;
                        param2 = rss.item[index].title;
                        param3= rss.item[index].description;
                        console.log(param1 + " " + param2 + " " + param3 )
                        const existSqueal = await squealModel.findOne({linkRss: param1});
                        console.log(existSqueal + "cosa c'è")
                        if(!existSqueal) {
                            const reactionAngry = new reactionModel({
                                name: "angry",
                            })
                            await reactionAngry.save();
                            const reactionDislike = new reactionModel({
                                name: "dislike",
                            })
                            await reactionDislike.save();
                            const reactionNormal = new reactionModel({
                                name: "normal",
                            })
                            await reactionNormal.save();
                            const reactionLike = new reactionModel({
                                name: "like",
                            })
                            await reactionLike.save();
                            const reactionHeart = new reactionModel({
                                name: "heart",
                            })
                            await reactionHeart.save();
                            const squeal = new squealModel({
                                sender: "NYTimes",
                                text: param2 + '\n' + param3,
                                date: new Date(),
                                resqueal: "",
                                reactions: [reactionAngry, reactionDislike, reactionNormal, reactionLike, reactionHeart],
                                CM: "",
                                linkRss: param1
                            });
                            const squealSaved = await squeal.save();
                            console.log(squealSaved + "computer")
                            await inboxModel.findOneAndUpdate({receiver: '§NEWS'}, {$push: {squealsIds: squealSaved._id.toHexString()}}, {new: true});
                        }

                    }
                }
            });
        })
        .catch((error) => {
            console.error('Errore nel recupero del feed RSS', error);
        });
}

cronJob.schedule('*/5 * * * *', () => {
    getRss();
});




// Definisci la funzione cron asincrona
const eseguiCronJob = async () => {
    console.log("genero");
    try {
        let immagineBase64 = '';

        const idImmagineCasuale = Math.floor(Math.random() * 1000);
        const larghezza = 200;
        const altezza = 200;

        const url = `https://picsum.photos/${larghezza}/${altezza}?random=${idImmagineCasuale}`;


        const reactionAngry = new reactionModel({
            name: "angry",
            //usersIds: ["aCaso"],
        })
        await reactionAngry.save();
        const reactionDislike = new reactionModel({
            name: "dislike",
        })
        await reactionDislike.save();
        const reactionNormal = new reactionModel({
            name: "normal",
        })
        await reactionNormal.save();
        const reactionLike = new reactionModel({
            name: "like",
        })
        await reactionLike.save();
        const reactionHeart = new reactionModel({
            name: "heart",
        })
        await reactionHeart.save();
        const squeal = new squealModel({
            sender: "LoremPicsum",
            text: "",
            //geolocation: "",
            img: url,
            date: new Date(),
            reactions: [reactionAngry, reactionDislike, reactionNormal, reactionLike, reactionHeart],
        });

        const newSqueal = await squeal.save();

        //const receiversArr0 = ;

        await inboxModel.findOneAndUpdate(
            {receiver: "§RANDOMIMG"}, // Query condition to find the document
            {$push: {squealsIds: newSqueal._id.toHexString()}}, // Update operation to push the new string
            {new: true}, // Option to return the updated document
        );
        const notification = new notificationModel({
            title: "New Squeal from " + " LoremPicsum ",
            text: "Check out the new Squeal from {*tag*{@" + " LoremPicsum " + "}*tag*} in {*tag*{" + "§RANDOMIMG" + "}*tag*}",
            sender: "LoremPicsum",
            date: new Date(),
        });
        await notification.save();
        /*const channel = await channelModel.findOne({name: "§prova immagini"}, {_id: true})
        const channelUsers = await userModel.find({channelsIds: {$in: "652a6759cf14972f79259798"}})
        for (let user of channelUsers) {
            await inboxModel.findOneAndUpdate({receiver: "@" + user.username}, {$push: {notificationsIds: notification._id.toHexString()}})
        }*/

    } catch (errore) {
        console.error('Errore durante l\'invio dell\'immagine:', errore.message);
    }
};

cronJob.schedule('*/5 * * * *', eseguiCronJob);



const eseguiMeteo = async () => {
    console.log("genero Meteo");
    const apiKey = '7f7a4bb0b9b35f1d55ace42668684e6b';
    const city = 'Bologna';
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(apiUrl)
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            let temperatura = parseInt(data.main.temp) - 273.15;

            let umidita = data.main.humidity  + "%";
            let pressione = data.main.pressure + "hPa";
            let descrizione = data.weather[0].description;
            creaSquealMeteo(temperatura, umidita, pressione, descrizione);
        })

    async function creaSquealMeteo(temperatura, umidita, pressione, descrizione){
        const reactionAngry = new reactionModel({
            name: "angry",
            //usersIds: ["aCaso"],
        })
        await reactionAngry.save();
        const reactionDislike = new reactionModel({
            name: "dislike",
        })
        await reactionDislike.save();
        const reactionNormal = new reactionModel({
            name: "normal",
        })
        await reactionNormal.save();
        const reactionLike = new reactionModel({
            name: "like",
        })
        await reactionLike.save();
        const reactionHeart = new reactionModel({
            name: "heart",
        })
        await reactionHeart.save();
        const squeal = new squealModel({
            sender: "OpenWeather",
            text: "temperatura: " + temperatura +
                    "\n\numidita: " + umidita +
                    "\n\npressione: " + pressione +
                    "\n\ndescrizione: " + descrizione,
            //geolocation: "",
            //img:,
            date: new Date(),
            reactions: [reactionAngry, reactionDislike, reactionNormal, reactionLike, reactionHeart],
        });

        const newSqueal = await squeal.save();

        await inboxModel.findOneAndUpdate(
            {receiver: "§WEATHERBOLO"}, // Query condition to find the document
            {$push: {squealsIds: newSqueal._id.toHexString()}}, // Update operation to push the new string
            {new: true}, // Option to return the updated document
        );
        const notification = new notificationModel({
            title: "New Squeal from " + " OpenWeather ",
            text: "Check out the new Squeal from {*tag*{@" + " OpenWeather " + "}*tag*} in {*tag*{" + "§WEATHERBOLO" + "}*tag*}",
            sender: "OpenWeather",
            date: new Date(),
        });
        await notification.save();
    }
};

cronJob.schedule('*/5 * * * *', eseguiMeteo);




const eseguiControversial = async () => {
    let squealsControversials = await squealModel.find({CM: "polarizzante"});
    console.log("polarizzanti:: " + squealsControversials);
};

cronJob.schedule('*/5 * * * *', eseguiControversial);




cronJob.schedule('0 0 * * *', async () => {
    //aggiorno caratteri giornalieri e tolgo la differenza ai cartetri settimanali

    let user = await userModel.find();
    for(let i = 0; i < user.length; i++){
        let char = user[i].characters;
        if(parseInt(char[0].number) < 300){
            let diff = 300 - parseInt(char[0].number);

            if(parseInt(char[0].number) > diff){
                char[0].number = String(parseInt(char[0].number) + diff);
                char[1].number = String(parseInt(char[1].number) - diff);
            }else{
                char[0].number = String(parseInt(char[0].number) + parseInt(char[1].number));
                char[1].number = "0";
            }
            await userModel.findOneAndUpdate({username: user[i].username}, {characters: char});
        }
    }
});

cronJob.schedule('0 0 * * 0', async () => {
    console.log("settimana");
    //aggiorno caratteri settimanali e tolgo la differenza ai caratteri mensili

    let user = await userModel.find();
    for(let i = 0; i < user.length; i++){
        let char = user[i].characters;
        if(parseInt(char[1].number) < 2100){
            let diff = 2100 - parseInt(char[1].number);

            if(parseInt(char[2].number) > diff){
                char[1].number = String(parseInt(char[1].number) + diff);
                char[2].number = String(parseInt(char[2].number) - diff);
            }else{
                char[1].number = String(parseInt(char[1].number) + parseInt(char[1].number));
                char[2].number = "0";
            }
            await userModel.findOneAndUpdate({username: user[i].username}, {characters: char});
        }
    }
});



cronJob.schedule('0 0 1 * *', async () => {
    console.log("mensilmente");
    //aggiorno caratteri mensili

    let user = await userModel.find();
    for(let i = 0; i < user.length; i++){
        let char = user[i].characters;
        if(parseInt(char[2].number) < 8400){
            char[2].number = "8400";
            await userModel.findOneAndUpdate({username: user[i].username}, {characters: char});
        }
    }
});


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
// /users/user/
// /users/user/banuser
app.post("/users/user", async (request, response) => {
    try {
        request.body["password"] = encrypt(request.body["password"]);
        console.log("sono dentro");

        const giornalieri = new charactersSchema({
            name: "giornalieri",
            number: "300",
        })
        console.log("prima del save");

        await giornalieri.save();
        console.log("1");

        const settimanali = new charactersSchema({
            name: "settimanali",
            number: "2100",
        })
        await settimanali.save();
        console.log("2");

        const mensili = new charactersSchema({
            name: "mensili",
            number: "8400",
        })
        await mensili.save();
        console.log("3");

        let caratteri = [giornalieri, settimanali, mensili];

        console.log("array caratteri::: " + caratteri);

        const user = new userModel({
            name: request.body.name,
            surname: request.body.surname,
            email: request.body.email,
            username: request.body.username,
            password: request.body.password,
            characters: caratteri,
            propic: request.body.propic
        });

        console.log("user::: " + user);


        await user.save();
        const inbox = new inboxModel({
            "receiver": '@' + request.body['username'],
        })
        await inbox.save();
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

app.post("/users/user/authenticate_user", async (request, response) => {
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

app.put("/users/user/change_password", async (request, response) => {
    try {
        if (!request.body.username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.json({
                result: "authentication failed"
            });
            return;
        }
        console.log(request.body.newPass + " " + request.body.username + " " + request.body.oldPass)
        const utente = await userModel.findOne({ username: request.body.username });
        if (utente) {
            console.log(utente['password']);
            console.log(decrypt(utente['password']));
            if (request.body.oldPass === decrypt(utente['password'])) {
                console.log("La password vecchia è corretta. Aggiorno la password...");
                // Crea una nuova password crittografata
                const encryptedNewPass = encrypt(request.body.newPass);
                // Esegui l'aggiornamento della password
                await userModel.findOneAndUpdate({ username: request.body.username }, { password: encryptedNewPass });
                response.send(true);
                console.log("Cambiamento effettuato");
            } else {
                response.send(false);
                console.log("La password vecchia non corrisponde");
            }
        } else {
            response.send(false);
            console.log("Utente non trovato");
        }
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.get("/users/user/existence_user", async (request, response) => {
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

app.get("/users/user/profilepic", async (request, response) => {
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
        const channels = resultChannels.map(channel => '§' + channel.name);
        let results = usernames.concat(channels);
        response.send(results);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.get("/users/user/search_user", async (request, response) => {
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

app.get("/channels/channel/search_channel", async (request, response) => {
    try {
        const substringToSearch = request.query.value; // Replace with the substring you want to search for
        const resultChannels = await channelModel.find({ name: { $regex: new RegExp(substringToSearch), $options: 'i' } }, { _id: false, name: true });
        const channels = resultChannels.map(channel => '§' + channel.name);
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

app.get("/squeals", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.json({
                result: "authentication failed"
            })
            return;
        }

        const user = await userModel.findOne({username: username}, {channelsIds: true, username: true, _id: false});
        const idToFind = request.query.squealId;
        const squeal = await squealModel.findOne({_id: idToFind});
        if(!squeal){
            response.status(404).send();
            return;
        }
        if(user) {
            if(squeal.sender === user.username){
                response.send(squeal)
                return;
            }
            const userInbox = await inboxModel.findOne({receiver: '@' + username}, {squealsIds: true, _id: false})
            if(userInbox !== null && userInbox.squealsIds.includes(idToFind)) {
                response.send(squeal);
                return;
            }
            const channelsIds = user.channelsIds;
            for(let channelId of channelsIds) {
                const channel = await channelModel.findOne({_id: channelId}, {name: true, _id: false});
                const inbox = await inboxModel.findOne({receiver: '§' + channel.name}, {squealsIds: true, _id: false});
                if(inbox === null){
                    continue;
                }
                const squealsIds = inbox.squealsIds;
                if(squealsIds.includes(idToFind)) {
                    response.send(squeal);
                    return;
                }
            }
            response.status(404).send();
        }
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.get("/channels/channels_squeals", async (request, response) => {
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
                const inbox = await inboxModel.findOne({receiver: '§' + channel.name}, {squealsIds: true, _id: false});
                if(inbox === null){
                    continue;
                }
                const squealsIds = inbox.squealsIds;
                for(let squealId of squealsIds) {
                    let squeal = await squealModel.findOne({_id: squealId});

                    squeal = {
                        id: squeal._id.toHexString(),
                        from: '§' + channel.name,
                        sender: squeal.sender,
                        geolocation: squeal.geolocation,
                        img: squeal.img,
                        text: squeal.text,
                        date: squeal.date,
                        resqueal: squeal.resqueal
                    }
                    squeals.push(squeal);
                }
            }
            const squealerChannels = await channelModel.find({channelType: 'squealer'});
            for(let squealerChannel of squealerChannels) {
                const squealerChannelInbox = await inboxModel.findOne({receiver: '§' + squealerChannel.name});
                const squealerSquealsIds = squealerChannelInbox.squealsIds;
                for(let squealerSquealId of squealerSquealsIds) {
                    let squeal = await squealModel.findOne({_id: squealerSquealId});

                    squeal = {
                        id: squeal._id.toHexString(),
                        from: '§' + squealerChannel.name,
                        sender: squeal.sender,
                        geolocation: squeal.geolocation,
                        img: squeal.img,
                        text: squeal.text,
                        date: squeal.date,
                        resqueal: squeal.resqueal
                    }
                    squeals.push(squeal);
                }
            }
            squeals.sort(compareSquealsDate);
            response.send(squeals);
            return;
        }
        response.status(400).send([]);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.get("/squeals/unlogged_squeals", async (request, response) => {
    try{
        let squeals = [];
        const squealerChannels = await channelModel.find({channelType: 'squealer'});
        for(let squealerChannel of squealerChannels) {
            const squealerChannelInbox = await inboxModel.findOne({receiver: '§' + squealerChannel.name});
            const squealerSquealsIds = squealerChannelInbox.squealsIds;
            for(let squealerSquealId of squealerSquealsIds) {
                let squeal = await squealModel.findOne({_id: squealerSquealId});
                squeal = {
                    id: squeal._id.toHexString(),
                    from: '§' + squealerChannel.name,
                    sender: squeal.sender,
                    geolocation: squeal.geolocation,
                    img: squeal.img,
                    text: squeal.text,
                    date: squeal.date,
                    resqueal: squeal.resqueal
                }
                squeals.push(squeal);
            }
        }
        squeals.sort(compareSquealsDate);
        response.send(squeals);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.get("/squeals/explore_squeals", async (request, response) => {
    try{
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.json({
                result: "authentication failed"
            })
            return;
        }
        let squeals = [];
        const user = await userModel.findOne({username: username});
        const channels = await channelModel.find({_id: {$nin: user.squealsIds}, channelType: 'user', access: 'public'});
        for(let channel of channels) {
            const inbox = await inboxModel.findOne({receiver: '§' + channel.name}, {squealsIds: true, _id: false});
            const squealsIds = inbox.squealsIds;
            for(let squealId of squealsIds) {
                let squeal = await squealModel.findOne({_id: squealId});

                squeal = {
                    id: squeal._id.toHexString(),
                    from: '§' + channel.name,
                    sender: squeal.sender,
                    geolocation: squeal.geolocation,
                    img: squeal.img,
                    text: squeal.text,
                    date: squeal.date,
                    resqueal: squeal.resqueal
                }
                squeals.push(squeal);
            }
        }

        response.send(squeals);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.get("/squeals/private_squeals", async (request, response) => {
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
        let squeals = [];
        if(inbox) {
            const squealsIds = inbox.squealsIds;
            for(let squealId of squealsIds) {
                let squeal = await squealModel.findOne({_id: squealId});
                squeal = {
                    id: squeal._id.toHexString(),
                    sender: squeal.sender,
                    geolocation: squeal.geolocation,
                    img: squeal.img,
                    text: squeal.text,
                    date: squeal.date,
                    resqueal: squeal.resqueal
                }
                squeals.push(squeal);
            }
            squeals.sort(compareSquealsDate);
        }
        response.send(squeals);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.get("/squeals/squeal/related_squeals", async (request, response) => {
    try {
        let username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.json({
                result: "authentication failed"
            })
            return;
        }

        const usernameQueried = request.query.username;
        const user = await userModel.findOne({username: username}, {channelsIds: true, _id: false});
        let squeals = [];

        for(let channelId of user.channelsIds) {
            const channel = await channelModel.findOne({_id: channelId}, {name: true, _id: false});
            const inbox = await inboxModel.findOne({receiver: '§' + channel.name}, {squealsIds: true, _id: false});
            if(inbox) {
                for (let squealId of inbox.squealsIds) {
                    let squeal = await squealModel.findOne({_id: squealId});
                    if (squeal.sender === usernameQueried) {
                        squeal = {
                            id: squeal._id.toHexString(),
                            from: '§' + channel.name,
                            sender: squeal.sender,
                            geolocation: squeal.geolocation,
                            img: squeal.img,
                            text: squeal.text,
                            date: squeal.date,
                            resqueal: squeal.resqueal
                        }
                        squeals.push(squeal);
                    }
                }
            }
        }
        squeals.sort(compareSquealsDate);
        response.send(squeals);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.get("/squeals/squeal/channel_squeals", async (request, response) => {
    try {
        let username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.status(403);
            response.json({
                result: "authentication failed"
            })
            return;
        }

        if(request.query.name === "CONTROVERSIAL"){
            let squealsControversials = await squealModel.find({CM: "polarizzante"});
            let squeals = [];

            for(let i = 0; i < squealsControversials.length; i++) {
                console.log(squealsControversials[i].text);
                let squeal = await squealModel.findOne({_id: squealsControversials[i]._id});

                squeal = {
                    id: squealsControversials[i]._id.toHexString(),
                    sender: squealsControversials[i].sender,
                    geolocation: squealsControversials[i].geolocation,
                    img: squealsControversials[i].img,
                    text: squealsControversials[i].text,
                    date: squealsControversials[i].date,
                    resqueal: squealsControversials[i].resqueal,
                    CM: squealsControversials[i].CM
                }
                squeals.push(squeal);
            }
            response.send(squeals);

        }else{
            const channelQueried = request.query.name;
            console.log(channelQueried);
            const user = await userModel.findOne({username: username}, {channelsIds: true, _id: false});
            const channel = await channelModel.findOne({name: channelQueried})
            console.log(channel);
            if(!channel){
                response.status(404).send("Channel not found");
                return;
            }
            if(channel.access !== "public" && !(user.channelsIds.includes(channel._id))){
                response.status(403).send("You are not a member of the channel");
                return;
            }
            let squeals = [];
            const inbox = await inboxModel.findOne({receiver: '§' + channelQueried}, {squealsIds: true, _id: false});
            for(let squealId of inbox.squealsIds) {
                let squeal = await squealModel.findOne({_id: squealId});

                squeal = {
                    id: squeal._id.toHexString(),
                    sender: squeal.sender,
                    geolocation: squeal.geolocation,
                    img: squeal.img,
                    text: squeal.text,
                    date: squeal.date,
                    resqueal: squeal.resqueal,
                    CM: squeal.CM
                }
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

app.post("/squeals/squeal/post_squeal", async (request, response) => {
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
        let flag = true;

        if(!request.body.receivers){
            response.status(400).send('You must specify at least one receiver');
            return;
        }
        const receiversArr0 = request.body.receivers;
        let differenza = 0;
        for(let receiverUsername of receiversArr0){
            if(receiverUsername.charAt(0) === '§') {
                const arrayCaratteri = await userModel.findOne({username: request.body.sender},{characters: true});

                if(request.body.text){
                    differenza = parseInt(arrayCaratteri.characters[0].number) - request.body.text.length;

                }else if(request.body.geolocation){
                    differenza = parseInt(arrayCaratteri.characters[0].number) - 125;

                }else if(request.body.img){
                    differenza = parseInt(arrayCaratteri.characters[0].number) - 125;
                }
            }
            if(differenza < 0){
                console.log("superato numero di caratteri");
                flag = false;
            }
        }

        if(!flag) {
            response.status(400).send('Characters amount exceeded')
            console.log("superato limite di craatteri");
        }else{

            const reactionAngry = new reactionModel({
                name: "angry",
                //usersIds: ["aCaso"],
            })
            await reactionAngry.save();
            const reactionDislike = new reactionModel({
                name: "dislike",
            })
            await reactionDislike.save();
            const reactionNormal = new reactionModel({
                name: "normal",
            })
            await reactionNormal.save();
            const reactionLike = new reactionModel({
                name: "like",
            })
            await reactionLike.save();
            const reactionHeart = new reactionModel({
                name: "heart",
            })
            await reactionHeart.save();

            if(!(!request.body.text || request.body.text.trim() !== "") && !request.body.geolocation && !request.body.img) {
                response.status(400).send('Squeal body is mandatory');
                return;
            }
            const squeal = new squealModel({
                sender: request.body.sender,
                text: request.body.text,
                geolocation: request.body.geolocation,
                img: request.body.img,
                date: new Date(),
                reactions: [reactionAngry, reactionDislike, reactionNormal, reactionLike, reactionHeart],
            });
            const sender = await userModel.findOne({username: request.body.sender});
            const newSqueal = await squeal.save();
            const receiversArr = request.body.receivers;
            for(let receiverUsername of receiversArr){
                if (await inboxModel.findOne({ receiver: receiverUsername })) {
                    if(receiverUsername.charAt(0) === '§') {//aggiorna caratteri giornaalieri---------
                        const arrayCaratteri = await userModel.findOne({username: request.body.sender}, {characters: true});
                        let aggiunta = 0;
                        if (request.body.text) {
                            aggiunta = parseInt(arrayCaratteri.characters[0].number) - request.body.text.length;

                        } else if (request.body.geolocation) {
                            aggiunta = parseInt(arrayCaratteri.characters[0].number) - 125;
                        } else if (request.body.img) {
                            aggiunta = parseInt(arrayCaratteri.characters[0].number) - 125;
                        }

                        //let aggiunta = parseInt(arrayCaratteri.characters[0].number) - request.body.text.length;
                        arrayCaratteri.characters[0].number = String(aggiunta);
                        await userModel.findOneAndUpdate({username: request.body.sender}, {$set: {characters: arrayCaratteri.characters}});
                        const channel = await channelModel.findOne({name: receiverUsername.slice(1)});

                        if(!sender.admin) {
                            if (channel.channelType === 'squealer') {
                                response.status(403).send('You have no permission to write on a squealer channel');
                                return
                            } else if (!sender.channelsIds.includes(channel._id.toHexString())) {
                                response.status(403).send('You are not a member of the channel ' + channel.name);
                                return;
                            } else if (channel.writingRestriction && !channel.writers.includes(sender.username)) {
                                response.status(403).send('You have no permits to write on ' + channel.name);
                                return;
                            }
                        }
                        await inboxModel.findOneAndUpdate(
                            {receiver: receiverUsername}, // Query condition to find the document
                            {$push: {squealsIds: newSqueal._id.toHexString()}}, // Update operation to push the new string
                            {new: true}, // Option to return the updated document
                        );
                        const notification = new notificationModel({
                            title: "New Squeal from " + request.body.sender,
                            text: "Check out the new Squeal from {*tag*{@" + request.body.sender + "}*tag*} in {*tag*{" + receiverUsername + "}*tag*}",
                            sender: request.body.sender,
                            date: new Date(),
                        });
                        await notification.save();

                        const channelUsers = await userModel.find({channelsIds: {$in: [channel._id.toHexString()]}})
                        if(channel.channelType === 'squealer'){
                            await inboxModel.updateMany({}, {$push: {notificationsIds: notification._id.toHexString()}}, {new: true});
                        } else {
                            for (let user of channelUsers) {
                                await inboxModel.findOneAndUpdate({receiver: "@" + user.username}, {$push: {notificationsIds: notification._id.toHexString()}})
                            }
                        }
                    } else {
                        const notification = new notificationModel({
                            title: "New Squeal from " + request.body.sender,
                            text: "Check out the new Squeal from {*tag*{@" + request.body.sender + "}*tag*}",
                            sender: request.body.sender,
                            date: new Date(),
                        });
                        await notification.save();
                        await inboxModel.findOneAndUpdate(
                            {receiver: receiverUsername}, // Query condition to find the document
                            {$push: {squealsIds: newSqueal._id.toHexString(), notificationsIds: notification._id.toHexString()}}, // Update operation to push the new string
                            {new: true}, // Option to return the updated document
                        );
                    }
                } else { // to remove maybe
                    const inbox = new inboxModel({
                        receiver: receiverUsername,
                        squealsIds: [newSqueal._id.toHexString()],
                        notificationsIds: [notification._id.toHexString()]
                    })
                    await inbox.save();
                }
            }

            response.send('squeal posted');
        }
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.post("/squeals/squeal/post_resqueal", async (request, response) => {
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
        const reactionAngry = new reactionModel({
            name: "angry",
            //usersIds: ["aCaso"],
        })
        await reactionAngry.save();
        const reactionDislike = new reactionModel({
            name: "dislike",
        })
        await reactionDislike.save();
        const reactionNormal = new reactionModel({
            name: "normal",
        })
        await reactionNormal.save();
        const reactionLike = new reactionModel({
            name: "like",
        })
        await reactionLike.save();
        const reactionHeart = new reactionModel({
            name: "heart",
        })
        await reactionHeart.save();
        const squeal = new squealModel({
            sender: request.body.sender,
            text: request.body.text,
            resqueal: request.body.resqueal,
            date: new Date(),
            reactions: [reactionAngry, reactionDislike, reactionNormal, reactionLike, reactionHeart],
        });
        const newSqueal = await squeal.save();
        const receiverUsername = request.body.receivers[0];
        if (await inboxModel.findOne({ receiver: receiverUsername })) {
            if(receiverUsername.charAt(0) === '§') {
                await inboxModel.findOneAndUpdate(
                    {receiver: receiverUsername}, // Query condition to find the document
                    {$push: {squealsIds: newSqueal._id.toHexString()}}, // Update operation to push the new string
                    {new: true}, // Option to return the updated document
                );
                const notification = new notificationModel({
                    title: "New Resqueal from " + request.body.sender,
                    text: "Check out the new Resqueal from {*tag*{@" + request.body.sender + "}*tag*} in {*tag*{" + receiverUsername + "}*tag*}",
                    sender: request.body.sender,
                    date: new Date(),
                });
                await notification.save();
                const channel = await channelModel.findOne({name: receiverUsername.slice(1)}, {_id: true})
                const channelUsers = await userModel.find({channelsIds: {$in: [channel._id.toHexString()]}})
                for(let user of channelUsers) {
                    await inboxModel.findOneAndUpdate({receiver: "@" + user.username}, {$push: {notificationsIds: notification._id.toHexString()}})
                }
            } else {
                const notification = new notificationModel({
                    title: "New Resqueal from " + request.body.sender,
                    text: "Check out the new Resqueal from {*tag*{@" + request.body.sender + "}*tag*}",
                    sender: request.body.sender,
                    date: new Date(),
                });
                await notification.save();
                await inboxModel.findOneAndUpdate(
                    {receiver: receiverUsername}, // Query condition to find the document
                    {$push: {squealsIds: newSqueal._id.toHexString(), notificationsIds: notification._id.toHexString()}}, // Update operation to push the new string
                    {new: true}, // Option to return the updated document
                );
            }
        } else { // to remove maybe
            const inbox = new inboxModel({
                receiver: receiverUsername,
                squealsIds: [newSqueal._id.toHexString()],
                notificationsIds: [notification._id.toHexString()]
            })
            await inbox.save();
        }

        response.json({
            result: "successful"
        });
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

//  Check user reaction existence
app.get("/squeals/squeal/:squealId", async (request, response) => {
    try {
        let username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.status(403);
            response.json({
                result: "authentication failed"
            })
            return;
        }

        const user = await userModel.findOne({username: request.query.username}, {_id: true});
        if(!user){
            response.status(404).send("User not found");
            return;
        }

        const squeal = await squealModel.findOne({_id: request.params.squealId}, {reactions: true});
        if(!user){
            response.status(404).send("Squeal not found");
            return;
        }
        for(let i=0; i<squeal.reactions.length; i++) {
            if(squeal.reactions[i].usersIds.includes(user._id.toHexString())){
                response.send(squeal.reactions[i].name);
                return;
            }
        }
        response.send("unreacted");
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});


app.put("/users/user/reactions/add_reaction", async (request, response) => {
    try{
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.status(401);
            response.json({
                result: "authentication failed"
            });
            return;
        }

        console.log("request.query.squealId:: " + request.body.squealId);
        console.log("request.query.type:: " + request.body.reactionType);
        console.log("request.query.username:: " + request.body.username);

        let squealId = request.body.squealId;
        const array = await squealModel.findOne({_id: squealId});
        let index = null;

        if(request.body.reactionType === "angry"){
            index = 0;
        }else if(request.body.reactionType === "dislike"){
            index = 1;
        }else if(request.body.reactionType === "normal"){
            index = 2;
        }else if(request.body.reactionType === "like"){
            index = 3;
        }else if(request.body.reactionType === "heart"){
            index = 4;
        }else {
            index = 5;
        }

        const idUser = await userModel.findOne({username: request.body.username},{_id: true});

        let admin = await userModel.findOne({username: request.body.username},{admin: true})
        let flag = false;
        if(admin.admin === true){
            console.log("sei admin");
            flag = true;
        }

        console.log("admin::: " + flag);

        if(index == 5){

            for(let i = 0; i < 5; i++){
                const objWithIdIndex = array.reactions[i].usersIds.indexOf(idUser._id);
                console.log("objWithIdIndex:: " + objWithIdIndex);

                if (objWithIdIndex > -1) {
                    array.reactions[i].usersIds.splice(objWithIdIndex, 1);
                    await squealModel.findOneAndUpdate({_id:squealId}, {$set: {reactions: array.reactions}},{new : true});
                    i = 5;
                }
            }

        }else{
            if(flag === true){
                array.reactions[index].usersIds.push(idUser._id);
                await squealModel.findOneAndUpdate({_id:squealId}, {$set: {reactions: array.reactions}},{new : true});

            }else{
                for(let i = 0; i < 5; i++){
                    const objWithIdIndex = array.reactions[i].usersIds.indexOf(idUser._id);
                    console.log("objWithIdIndex:: " + objWithIdIndex);

                    if (objWithIdIndex > -1) {

                        array.reactions[i].usersIds.splice(objWithIdIndex, 1);
                        await squealModel.findOneAndUpdate({_id:squealId}, {$set: {reactions: array.reactions}},{new : true});
                        i = 5;
                    }
                }

                array.reactions[index].usersIds.push(idUser._id);
                await squealModel.findOneAndUpdate({_id:squealId}, {$set: {reactions: array.reactions}},{new : true});

            }
        }

        let total = 0;
        let positive = 0;
        let negative = 0;

        for(let i = 0; i < 5; i++){
            total = total + array.reactions[i].usersIds.length;
        }
        console.log("total " + total);

        positive = array.reactions[3].usersIds.length + (array.reactions[4].usersIds.length * 2);
        console.log("positive " + positive);
        negative = array.reactions[1].usersIds.length + (array.reactions[0].usersIds.length * 2);
        console.log("negative " + negative);


        let user = await userModel.findOne({username: request.body.username});

        const arrayCaratteri = await userModel.findOne({username: request.body.username},{characters: true});

        //console.log("charactersVariabile: " + arrayCaratteri);
        //console.log("characters 0: " + arrayCaratteri.characters[0].number);

        let CM = total * 0.25;

        if(CM < positive && CM > negative && CM > 1){

            if(await squealModel.findOne({_id:squealId, CM: "popolare"})){
                console.log("è gia popolare");
            }else{
                await squealModel.findOneAndUpdate({_id:squealId}, {$set: {CM: "popolare"}},{new : true});

                let usernamePopolare = await squealModel.findOne({_id:squealId, CM: "popolare"}, {sender: true});
                console.log("username popolare::   " + usernamePopolare.get("sender"));

                let squealPopolari = await squealModel.find({sender: usernamePopolare.get("sender"), CM: "popolare"});
                console.log("squeal popolari:: " + squealPopolari.length);

                if(squealPopolari.length % 3 == 0){
                    let aggiunta = Math.trunc(2 * (parseInt(arrayCaratteri.characters[0].number)/100));
                    let totale = parseInt(arrayCaratteri.characters[0].number) + aggiunta;
                    arrayCaratteri.characters[0].number = String(totale);
                    await userModel.findOneAndUpdate({username: request.body.username}, {$set: {characters: arrayCaratteri.characters}});
                }
            }

        }else if(total*0.25 > positive && total*0.25 < negative && CM > 1){

            if(await squealModel.findOne({_id:squealId, CM: "impopolare"})){
                console.log("è gia impopolare");
            }else{
                await squealModel.findOneAndUpdate({_id:squealId}, {$set: {CM: "impopolare"}},{new : true});

                let usernameImpopolare = await squealModel.findOne({_id:squealId, CM: "impopolare"}, {sender: true});
                console.log("username impopolare::   " + usernameImpopolare.get("sender"));

                let squealImpopolari = await squealModel.find({sender: usernameImpopolare.get("sender"), CM: "impopolare"});
                console.log("squeal impopolare:: " + squealImpopolari.length);

                if(squealImpopolari.length % 3 == 0){
                    let aggiunta = Math.trunc(2 * (parseInt(arrayCaratteri.characters[0].number)/100));

                    let diminuzione = parseInt(arrayCaratteri.characters[0].number) - aggiunta;
                    arrayCaratteri.characters[0].number = String(diminuzione);
                    await userModel.findOneAndUpdate({username: request.body.username}, {$set: {characters: arrayCaratteri.characters}});
                }
            }

        }else if(total*0.25 < positive && total*0.25 < negative  && CM > 1){
            await squealModel.findOneAndUpdate({_id:squealId}, {$set: {CM: "polarizzante"}},{new : true});

        }



        response.json({
            result: "success"
        })
    }catch(error){
        response.status(500).send(error);
        console.log(error);
    }
});


app.get("/users/user/characters/daily", async (request, response) => {
    try {
        let caratteri = await userModel.findOne({username: request.query.username},{characters: true});

        console.log("caratteri:: " + caratteri.characters[0].number);
        response.send(caratteri.characters[0].number);

    } catch (error) {
        response.status(500).send(error);
    }
});



//  Create a squealer channel
app.post("/channels/squealerChannels/", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.status(401);
            response.json({
                result: "authentication failed"
            });
            return;
        }

        const user = await userModel.findOne({username: username});

        if(!user.admin) {
            response.status(403).send('User is not an admin');
            return;
        } else if(request.body.channelName.trim() === '') {
            response.status(400).send('Channel name must be specified');
            return;
        } else if(request.body.channelDescription.trim() === '') {
            response.status(400).send('Channel description must be specified');
            return;
        }

        const channelExistence = await channelModel.findOne({name: request.body.channelName.toUpperCase()});
        if(channelExistence) {
            response.status(400).send('Channel name already exist');
            return;
        } else {
            const channel = new channelModel({
                name: request.body.channelName.toUpperCase(),
                description: request.body.channelDescription,
                channelType: 'squealer'
            });
            await channel.save();
            const inbox = new inboxModel({
                receiver: '§' + request.body.channelName.toUpperCase()
            });
            await inbox.save();
            response.send('Squealer channel created successfully')
        }

    } catch (error) {
        response.status(500).send(error);
    }
});

//  Update squealer channel description
app.post("/channels/squealerChannels/squealerChannel/description", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.status(401);
            response.json({
                result: "authentication failed"
            });
            return;
        }

        const user = await userModel.findOne({username: username});

        if(!user.admin) {
            response.status(403).send('User is not an admin');
            return;
        } else if(request.body.channelName.trim() === '') {
            response.status(400).send('Channel name must be specified');
            return;
        } else if(request.body.channelDescription.trim() === '') {
            response.status(400).send('Channel description must be specified');
            return;
        }

        await channelModel.findOneAndUpdate({name: request.body.channelName.toUpperCase()}, {$set: {description: request.body.channelDescription}}, {new: true});
        response.send('Channel description updated');
    } catch (error) {
        response.status(500).send(error);
    }
});

//  Check the existence of a user channel
app.get("/channels/userChannels/existence", async (request, response) => {
    try {
        if(await channelModel.findOne({ name: request.query.name.toLowerCase() })) {
            response.send('exist');
        } else {
            response.send('notExist');
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

//  Promote user to owner
app.post("/channels/userChannels/userChannel/owners", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.status(401);
            response.json({
                result: "authentication failed"
            });
            return;
        }

        const user = await userModel.findOne({username: username});
        const userChannels = await userModel.findOne({username: username}, {channelsIds: true});
        const channel = await channelModel.findOne({name: request.body.channelName, channelType: "user"});
        const userToPromote = await userModel.findOne({username: request.body.toPromote});
        if(!userToPromote){
            response.status(404).send('User to promote doesn\'t exist');
            return;
        } else if(channel.owners.includes(userToPromote.username)) {
            response.status(400).send('User to promote is already an owner');
            return;
        }
        if(channel) {
            if(user.admin || (userChannels && userChannels.channelsIds.includes(channel._id.toHexString()))) {
                if(user.admin || channel.owners.includes(username)) {
                    const usernameToPromote = userToPromote.username;
                    await channelModel.findOneAndUpdate({name: channel.name}, {$push: {owners: usernameToPromote}}, {new: true});
                    const notification = new notificationModel({
                        title: "You have been promoted to owner by " + username,
                        text: "You have been promoted to owner in {*tag*{§" + channel.name + "}*tag*}",
                        sender: username,
                        date: new Date(),
                    });
                    await notification.save();
                    await inboxModel.findOneAndUpdate(
                        {receiver: '@' + usernameToPromote}, // Query condition to find the document
                        {$push: {notificationsIds: notification._id.toHexString()}}, // Update operation to push the new string
                        {new: true}, // Option to return the updated document
                    );
                    response.send('User promoted');
                    return;
                } else {
                    response.status(403).send('You are not an owner of this channel');
                    return;
                }
            } else {
                response.status(403).send('You are not a member of this channel');
                return;
            }
        } else {
            response.status(404).send('Channel doesn\'t exist');
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

//  Depromote user from channel owner
app.post("/channels/userChannels/userChannel/owners/depromote", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.status(401);
            response.json({
                result: "authentication failed"
            });
            return;
        }

        const userChannels = await userModel.findOne({username: username}, {channelsIds: true});
        const user = await userModel.findOne({username: username});
        const channel = await channelModel.findOne({name: request.body.channelName, channelType: "user"});
        const userToDepromote = await userModel.findOne({username: request.body.toDepromote});
        if(!userToDepromote){
            response.status(404).send('User to depromote doesn\'t exist');
            return;
        } else if(!channel.owners.includes(userToDepromote.username)) {
            response.status(400).send('User to depromote is not an owner');
            return;
        }
        if(channel) {
            if(user.admin || (userChannels && userChannels.channelsIds.includes(channel._id.toHexString()))) {
                if(user.admin || channel.owners.includes(username)) {
                    const usernameToDepromote = userToDepromote.username;
                    await channelModel.findOneAndUpdate({name: channel.name}, {$pull: {owners: usernameToDepromote}}, {new: true});
                    const notification = new notificationModel({
                        title: "You have been depromoted from owner by " + username,
                        text: "You have been depromoted from owner in {*tag*{§" + channel.name + "}*tag*}",
                        sender: username,
                        date: new Date(),
                    });
                    await notification.save();
                    await inboxModel.findOneAndUpdate(
                        {receiver: '@' + usernameToDepromote}, // Query condition to find the document
                        {$push: {notificationsIds: notification._id.toHexString()}}, // Update operation to push the new string
                        {new: true}, // Option to return the updated document
                    );
                    response.send('User depromoted');
                    return;
                } else {
                    response.status(403).send('You are not an owner of this channel');
                    return;
                }
            } else {
                response.status(403).send('You are not a member of this channel');
                return;
            }
        } else {
            response.status(404).send('Channel doesn\'t exist');
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

//  Promote a user to writer
app.post("/channels/userChannels/userChannel/writers", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.status(401);
            response.json({
                result: "authentication failed"
            });
            return;
        }

        const userChannels = await userModel.findOne({username: username}, {channelsIds: true});
        const user = await userModel.findOne({username: username});
        const channel = await channelModel.findOne({name: request.body.channelName, channelType: "user"});
        const userToAdd = await userModel.findOne({username: request.body.toAdd});
        if(!userToAdd){
            response.status(404).send('User to add to writers doesn\'t exist');
            return;
        } else if(!userToAdd.channelsIds.includes(channel._id.toHexString())) {
            response.status(400).send('User to add to writers is not a member of this channel');
            return;
        } else if(channel.writers.includes(userToAdd.username)) {
            response.status(400).send('User to add is already a writer');
            return;
        }
        if(channel) {
            if(channel.writingRestriction !== true) {
                response.status(400).send('Channel has no writing restriction');
                return;
            }
            if(user.admin || (userChannels && userChannels.channelsIds.includes(channel._id.toHexString()))) {
                if(channel.owners.includes(username)) {
                    const usernameToAdd = userToAdd.username;
                    await channelModel.findOneAndUpdate({name: channel.name}, {$push: {writers: usernameToAdd}}, {new: true});
                    const notification = new notificationModel({
                        title: "You have been promoted to writer by " + username,
                        text: "You have been promoted to writer in {*tag*{§" + channel.name + "}*tag*}",
                        sender: username,
                        date: new Date(),
                    });
                    await notification.save();
                    await inboxModel.findOneAndUpdate(
                        {receiver: '@' + usernameToAdd}, // Query condition to find the document
                        {$push: {notificationsIds: notification._id.toHexString()}}, // Update operation to push the new string
                        {new: true}, // Option to return the updated document
                    );
                    response.send('User added to writers');
                    return;
                } else {
                    response.status(403).send('You are not an owner of this channel');
                    return;
                }
            } else {
                response.status(403).send('You are not a member of this channel');
                return;
            }
        } else {
            response.status(404).send('Channel doesn\'t exist');
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

//  Depromote a user from writer
app.post("/channels/userChannels/userChannel/writers/depromote", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.status(401);
            response.json({
                result: "authentication failed"
            });
            return;
        }

        const userChannels = await userModel.findOne({username: username}, {channelsIds: true});
        const user = await userModel.findOne({username: username});
        const channel = await channelModel.findOne({name: request.body.channelName, channelType: "user"});
        const userToRemove = await userModel.findOne({username: request.body.toRemove});
        if(!userToRemove){
            response.status(404).send('User to remove from writers doesn\'t exist');
            return;
        } else if(!channel.writers.includes(userToRemove.username)) {
            response.status(400).send('User to remove from writers is not a writer');
            return;
        }
        if(channel) {
            if(channel.writingRestriction !== true) {
                response.status(400).send('Channel has no writing restriction');
                return;
            }
            if(user.admin || (userChannels && userChannels.channelsIds.includes(channel._id.toHexString()))) {
                if(user.admin || channel.owners.includes(username)) {
                    const usernameToRemove = userToRemove.username;
                    await channelModel.findOneAndUpdate({name: channel.name}, {$pull: {writers: usernameToRemove}}, {new: true});
                    const notification = new notificationModel({
                        title: "You have been depromoted from writer by " + username,
                        text: "You have been depromoted from writer in {*tag*{§" + channel.name + "}*tag*}",
                        sender: username,
                        date: new Date(),
                    });
                    await notification.save();
                    await inboxModel.findOneAndUpdate(
                        {receiver: '@' + usernameToRemove}, // Query condition to find the document
                        {$push: {notificationsIds: notification._id.toHexString()}}, // Update operation to push the new string
                        {new: true}, // Option to return the updated document
                    );
                    response.send('User removed from writers');
                    return;
                } else {
                    response.status(403).send('You are not an owner of this channel');
                    return;
                }
            } else {
                response.status(403).send('You are not a member of this channel');
                return;
            }
        } else {
            response.status(404).send('Channel doesn\'t exist');
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

//  Remove a member to a channel
app.post("/channels/userChannels/userChannel/members/remove", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.status(401);
            response.json({
                result: "authentication failed"
            });
            return;
        }

        const userChannels = await userModel.findOne({username: username}, {channelsIds: true});
        const user = await userModel.findOne({username: username});
        const channel = await channelModel.findOne({name: request.body.channelName, channelType: "user"});
        const userToRemove = await userModel.findOne({username: request.body.toRemove});
        if(!userToRemove){
            response.status(404).send('User to remove from members doesn\'t exist');
            return;
        } else if(!userToRemove.channelsIds.includes(channel._id.toHexString())) {
            response.status(400).send('User to remove from members is not a member of the channel');
            return;
        }
        if(channel) {
            if(user.admin || (userChannels && userChannels.channelsIds.includes(channel._id.toHexString()))) {
                if(user.admin || channel.owners.includes(username)) {
                    await userModel.findOneAndUpdate({username: userToRemove.username}, {$pull: {channelsIds: channel._id.toHexString()}}, {new: true});
                    const notification = new notificationModel({
                        title: "You have been removed from channel by " + username,
                        text: "You have been removed from {*tag*{§" + channel.name + "}*tag*}",
                        sender: username,
                        date: new Date(),
                    });
                    await notification.save();
                    await inboxModel.findOneAndUpdate(
                        {receiver: '@' + userToRemove.username}, // Query condition to find the document
                        {$push: {notificationsIds: notification._id.toHexString()}}, // Update operation to push the new string
                        {new: true}, // Option to return the updated document
                    );
                    response.send('User removed from members');
                    return;
                } else {
                    response.status(403).send('You are not an owner of this channel');
                    return;
                }
            } else {
                response.status(403).send('You are not a member of this channel');
                return;
            }
        } else {
            response.status(404).send('Channel doesn\'t exist');
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

//  Add a member to a channel
app.post("/channels/userChannels/userChannel/members", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.status(401);
            response.json({
                result: "authentication failed"
            });
            return;
        }

        const userChannels = await userModel.findOne({username: username}, {channelsIds: true});
        const user = await userModel.findOne({username: username});
        const channel = await channelModel.findOne({name: request.body.channelName, channelType: "user"});
        const userToAdd = await userModel.findOne({username: request.body.toAdd});
        if(!userToAdd){
            response.status(404).send('User to add to members doesn\'t exist');
            return;
        } else if(userToAdd.channelsIds.includes(channel._id.toHexString())) {
            response.status(400).send('User to add to members is already a member of the channel');
            return;
        }
        if(channel) {
            if(user.admin || (userChannels && userChannels.channelsIds.includes(channel._id.toHexString()))) {
                if(user.admin || channel.owners.includes(username)) {
                    await userModel.findOneAndUpdate({username: userToAdd.username}, {$push: {channelsIds: channel._id.toHexString()}}, {new: true});
                    const notification = new notificationModel({
                        title: "You have been added to a channel by " + username,
                        text: "Check out your new channel {*tag*{§" + channel.name + "}*tag*}",
                        sender: username,
                        date: new Date(),
                    });
                    await notification.save();
                    await inboxModel.findOneAndUpdate(
                        {receiver: '@' + userToAdd.username}, // Query condition to find the document
                        {$push: {notificationsIds: notification._id.toHexString()}}, // Update operation to push the new string
                        {new: true}, // Option to return the updated document
                    );
                    response.send('User added to members');
                    return;
                } else {
                    response.status(403).send('You are not an owner of this channel');
                    return;
                }
            } else {
                response.status(403).send('You are not a member of this channel');
                return;
            }
        } else {
            response.status(404).send('Channel doesn\'t exist');
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

//  Set channel privacy
app.post("/channels/userChannels/userChannel/privacy", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.status(401);
            response.json({
                result: "authentication failed"
            });
            return;
        }

        const userChannels = await userModel.findOne({username: username}, {channelsIds: true})
        const channel = await channelModel.findOne({name: request.body.channelName, channelType: "user"});
        const user = await userModel.findOne({username: username});
        const privacy = request.body.privacy;
        if(!privacy){
            response.status(400).send('Privacy must be specified in the request');
            return;
        } else if(privacy === channel.access) {
            response.status(400).send('Channel is already ' + privacy);
            return;
        } else if(privacy !== 'public' && privacy !== 'private') {
            response.status(400).send('You have to specify a valid value for the channel privacy');
            return;
        }
        if(channel) {
            if(user.admin || (userChannels && userChannels.channelsIds.includes(channel._id.toHexString()))) {
                if(user.admin || channel.owners.includes(username)) {
                    await channelModel.findOneAndUpdate({name: channel.name}, {$set: {access: privacy}}, {new: true});
                    response.send('Privacy changed');
                    return;
                } else {
                    response.status(403).send('You are not an owner of this channel');
                    return;
                }
            } else {
                response.status(403).send('You are not a member of this channel');
                return;
            }
        } else {
            response.status(404).send('Channel doesn\'t exist');
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

//  Set channel writing restriction
app.post("/channels/userChannels/userChannel/writingrestriction", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.status(401);
            response.json({
                result: "authentication failed"
            });
            return;
        }

        const userChannels = await userModel.findOne({username: username}, {channelsIds: true})
        const channel = await channelModel.findOne({name: request.body.channelName, channelType: "user"});
        const user = await userModel.findOne({username: username});
        const writingRestriction = request.body.value;
        if(writingRestriction === ''){
            response.status(400).send('Writing restriction value must be specified in the request');
            return;
        } else if(writingRestriction === channel.writingRestriction) {
            response.status(400).send('Channel writing restriction is already ' + writingRestriction);
            return;
        }
        if(channel) {
            if(user.admin || (userChannels && userChannels.channelsIds.includes(channel._id.toHexString()))) {
                if(user.admin || channel.owners.includes(username)) {
                    await channelModel.findOneAndUpdate({name: channel.name}, {$set: {writingRestriction: writingRestriction}}, {new: true});
                    response.send('Writing restriction changed');
                    return;
                } else {
                    response.status(403).send('You are not an owner of this channel');
                    return;
                }
            } else {
                response.status(403).send('You are not a member of this channel');
                return;
            }
        } else {
            response.status(404).send('Channel doesn\'t exist');
        }
    } catch (error) {
        response.status(500).send(error);
        console.log(error);
    }
});

//  Retrieve information about a user channel
app.get("/channels/:channelName", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.status(401);
            response.json({
                result: "authentication failed"
            });
            return;
        }

        const userChannels = await userModel.findOne( {username: username}, {channelsIds: true} )
        const channel = await channelModel.findOne({ name: request.params.channelName});
        const user = await userModel.findOne({username: username});

        if(channel) {
            if(user.admin) {
                response.send(channel);
            } else if(channel.channelType === 'squealer' || (channel.access === 'public' || (userChannels && userChannels.channelsIds.includes(channel._id.toHexString())))) {
                response.send(channel);
            } else {
                response.status(403).send('You can\'t access this channel');
            }
        } else {
            response.status(404).send('Channel doesn\'t exist');
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

//  Create a user channel
app.post("/channels/userChannels/", async (request, response) => {
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
            let owners = [username];
            owners.concat(request.body.owners);
            const channel = new channelModel({
                name: request.body.name,
                owners: owners,
                channelType: "user",
                access: request.body.access
            });
            const newChannel = await channel.save();
            await userModel.findOneAndUpdate(
                {username: username},
                {$push: {channelsIds: newChannel._id.toHexString()}},
                {new: true},
            );
            const inbox = new inboxModel({
                "receiver": '§' + request.body.name,
            })
            await inbox.save();

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

// Subscribe to a channel
app.post("/channels/subscribe", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.status(401);
            response.json({
                result: "authentication failed"
            })
            return;
        }

        const channel = await channelModel.findOne({name: request.body.name});
        if (channel){
            if(channel.channelType === 'squealer'){
                response.status(400).send('You can\'t subscribe/unsubscribe to a squealer channel');
            } else if(channel.access !== "public"){
                response.status(403).send("Channel is private");
                return;
            }
            await userModel.findOneAndUpdate(
                {username: username}, // Query condition to find the document
                {$push: {channelsIds: channel._id.toHexString()}}, // Update operation to push the new string
                {new: true}, // Option to return the updated document
            );
            response.send("Subscription done")
        } else {
            response.status(404).send("channel doesn't exist");
            return;
        }
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

// Unsubscribe to a channel
app.post("/channels/unsubscribe", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.status(401);
            response.json({
                result: "authentication failed"
            })
            return;
        }

        const channel = await channelModel.findOne({name: request.body.name});
        if (channel){
            const user = await userModel.findOne({username: username});
            if(channel.channelType === 'squealer'){
                response.status(400).send('You can\'t subscribe/unsubscribe to a squealer channel');
            } else if(!user.channelsIds.includes(channel._id.toHexString())){
                response.status(400).send("The user is not subscribed to the channel");
                return;
            }
            await userModel.findOneAndUpdate({username: username}, {$pull: {channelsIds: channel._id.toHexString()}});
            await channelModel.findOneAndUpdate({name: channel.name}, {$pull: {owners: username}});
            response.send("Unsubscription done")
        } else {
            response.status(404).send("channel doesn't exist");
            return;
        }
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

//  Check channel subscription
app.get("/channels/:channelName", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.status(401);
            response.json({
                result: "authentication failed"
            });
            return;
        }

        const channelName = request.params.channelName;
        const usernameQueried = request.query.username;

        const channel = await channelModel.findOne({name: channelName}, {_id: true});
        const user = await userModel.findOne({username: usernameQueried});
        if(!user) {
            response.status(404).send("User not found");
            return;
        }

        if(user.channelsIds.includes(channel._id.toHexString())){
            response.send("Subscribed");
        } else {
            response.send("Unsubscribed");
        }
    } catch (error) {
        response.status(500).send(error);
    }
});


//  Retrieve user notifications
app.get("/users/user/notifications", async (request, response) => {
    try {
        let username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.status(403);
            response.json({
                result: "authentication failed"
            })
            return;
        }

        const notifications = []

        const user = await userModel.findOne({username: username}, {channelsIds: true});

        const inbox = await inboxModel.findOne({receiver: "@" + username});
        for(let notificationId of inbox.notificationsIds){
            const notification = await notificationModel.findOne({_id: notificationId});
            notifications.push(notification);
        }

        for(let channelId of user.channelsIds){
            const channel = await channelModel.findOne({_id: channelId});
            const channelInbox = await inboxModel.findOne({receiver: "§" + channel.name});
            for(let notificationId of channelInbox.notificationsIds){
                const notification = await notificationModel.findOne({_id: notificationId});
                notifications.push(notification);
            }
        }

        notifications.sort(compareNotificationsDate);
        response.send(notifications);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

//  Deletes a specific notification for the user logged
app.post("/users/user/notifications/notification", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.json({
                result: "authentication failed"
            })
            return;
        }

        await inboxModel.findOneAndUpdate({receiver: "@" + username}, {$pull: {notificationsIds: request.body.id}}, {new: true});
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
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

function compareNotificationsDate(a, b){
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

function compareSquealsDate(a, b){
    let dateA = new Date(a.date);
    let dateB = new Date(b.date);
    if(a.CM === 'popolare') {
        dateA.setDate(dateA.getDate() + 3);
    } else if(a.CM === 'impopolare') {
        dateA.setDate(dateA.getDate() - 3);
    }
    if(b.CM === 'popolare') {
        dateB.setDate(dateB.getDate() + 3);
    } else if(b.CM === 'impopolare') {
        dateB.setDate(dateB.getDate() - 3);
    }

    if(dateA - dateB > 0){
        return -1;
    } else if(dateA - dateB < 0) {
        return 1;
    } else {
        return 0;
    }
}

app.get("/users/user/admin", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.status(401);
            response.json({
                result: "authentication failed"
            });
            return;
        }

        const userAdmin = await userModel.findOne( {username: username}, {admin: true} )
        console.log(userAdmin)
        if(userAdmin.admin) {
            response.send(userAdmin.admin)
        } else {
            console.log("non sei admin");
            response.send('You are not admin');
        }
    } catch (error) {
        response.status(500).send(error);
    }
});
app.put("/users/user/block_user", async (request, response) => {
    try {

        console.log( request.body.username + "here we go")
        const blocked_user= request.body.username;
        await userModel.findOneAndUpdate({username: blocked_user}, {blocked: true});
        response.send(true);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});
app.put("/users/user/unblock_user", async (request, response) => {
    try {

        console.log( request.body.username + "here we go")
        const unblocked_user= request.body.username;
        await userModel.findOneAndUpdate({username: unblocked_user}, {blocked: false});
        response.send(true);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.get("/users/user/existence_block", async (request, response) => {
    try {
        if(await userModel.findOne({ username: request.query.username, blocked: true })) {
            response.send('yes');
        } else {
            response.send('no');
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/squeals/squeal/squealmerged_squeals", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.json({
                result: "authentication failed"
            });
            return;
        }

        const inboxes = await inboxModel.find({});
        let squeals = [];
        for(let inbox of inboxes){
            const squealsIds = await inbox.squealsIds;

            for(let squealId of squealsIds){
                let squeal = await squealModel.findOne({ _id: squealId });

                squeal = {
                    id: squeal._id.toHexString(),
                    from: inbox.receiver,
                    sender: squeal.sender,
                    geolocation: squeal.geolocation,
                    img: squeal.img,
                    text: squeal.text,
                    date: squeal.date,
                    resqueal: squeal.resqueal
                };
                squeals.push(squeal);
            }
        }
        squeals.sort(compareSquealsDate);
        response.send(squeals);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});
app.get("/squeals/squeal/search_sender", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.json({
                result: "authentication failed"
            });
            return;
        }
        const searchTheSender = request.query.value; // Replace with the substring you want to search for
        const inboxes = await inboxModel.find({});
        console.log("controllo del sender"+searchTheSender)
        //const resultSquealsSender = await squealModel.find({ sender: { $regex: new RegExp(searchTheSender), $options: 'i' } });

        let squeals = [];
        for(let inbox of inboxes){
            const squealsIds = await inbox.squealsIds;
            console.log("Diversi id degli squeal"+squealsIds)
            for(let squealIdSender of squealsIds ){
                let squeal = await squealModel.findOne({ _id: squealIdSender, sender: { $regex: new RegExp(searchTheSender), $options: 'i' } });

                if(squeal !== null && squeal !== undefined){
                    squeal = {
                        id: squeal._id.toHexString(),
                        from: inbox.receiver,
                        sender: squeal.sender,
                        geolocation: squeal.geolocation,
                        img: squeal.img,
                        text: squeal.text,
                        date: squeal.date,
                        resqueal: squeal.resqueal
                    };
                    squeals.push(squeal);
                }

            }
        }
        squeals.sort(compareSquealsDate);
        response.send(squeals);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});



app.get("/squeals/squeal/search_receiver", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.json({
                result: "authentication failed"
            });
            return;
        }
        const searchTheReceiver = request.query.value; // Replace with the substring you want to search for
        const inboxes = await inboxModel.findOne({receiver: { $regex: new RegExp(searchTheReceiver), $options: 'i' }});
        console.log("controllo del receiver" + inboxes)


        let squeals = [];
        for(let squealId of inboxes.squealsIds ){
            let squeal = await squealModel.findOne({ _id: squealId });

            if(squeal !== null && squeal !== undefined){
                squeal = {
                    id: squeal._id.toHexString(),
                    from: inboxes.receiver,
                    sender: squeal.sender,
                    geolocation: squeal.geolocation,
                    img: squeal.img,
                    text: squeal.text,
                    date: squeal.date,
                    resqueal: squeal.resqueal
                };
                squeals.push(squeal);
            }

        }

        squeals.sort(compareSquealsDate);
        response.send(squeals);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.get("/squeals/squeal/search_date", async (request, response) => {
    try {
        const username = await authenticateUser(request);
        if (!username) {
            response.cookie('jwt', '', { httpOnly: true, secure: true });
            response.json({
                result: "authentication failed"
            });
            return;
        }
        // Data in formato ISO 8601
        const searchTheDate = request.query.value;
        console.log(searchTheDate);
        const parts = searchTheDate.split('-'); // Dividi la stringa in parti
        const day = parseInt(parts[2], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[0], 10);
        console.log(day, month, year);
        // Crea un oggetto Data a partire dai componenti
        //const dateToCompare = new Date(year, month, day);
        //console.log(dateToCompare.getDate() + " " + (dateToCompare.getMonth()+1) + " " + dateToCompare.getFullYear() + "importato")
        // Replace with the substring you want to search for
        const inboxes = await inboxModel.find({});



        let squeals = [];
        for(let inbox of inboxes){
            const squealsIds = await inbox.squealsIds;
            for(let squealIdSender of squealsIds ){
                let squeal = await squealModel.findOne({ _id: squealIdSender });
                //, date: { $regex: new RegExp(searchTheDate), $options: 'i' }
                if(squeal !== null && squeal !== undefined){
                    console.log(squeal.date)
                    const squealDate = new Date(squeal.date);
                    console.log(squealDate.getDate());
                    console.log(squealDate.getDate() + " " + (squealDate.getMonth()+1) + " " + squealDate.getFullYear());

                    if (
                        day === squealDate.getDate() &&
                        month === (squealDate.getMonth()+1) &&
                        year === squealDate.getFullYear()
                    ){
                        console.log("sono qui")
                        squeal = {
                            id: squeal._id.toHexString(),
                            from: inbox.receiver,
                            sender: squeal.sender,
                            geolocation: squeal.geolocation,
                            img: squeal.img,
                            text: squeal.text,
                            date: squeal.date,
                            resqueal: squeal.resqueal
                        };
                        squeals.push(squeal);
                    }
                }
            }
        }
        response.send(squeals);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.put("/users/user/charcters/add_characters", async (request, response) => {
    try {

        const arrayCaratteri = await userModel.findOne({username: request.body.username},{characters: true});
        console.log(request.body.number + " l'errore ");
        if(request.body.number === 100){

            arrayCaratteri.characters[0].number = String (parseInt(arrayCaratteri.characters[0].number ) + 100);
            console.log(arrayCaratteri.characters[0].number);
        }else if(request.body.number === 200){

            arrayCaratteri.characters[1].number = String (parseInt(arrayCaratteri.characters[1].number ) + 200);
        } else if(request.body.number === 500){

            arrayCaratteri.characters[2].number = String (parseInt(arrayCaratteri.characters[2].number ) +500);
        }
        console.log(arrayCaratteri.characters  +  "caratteri")
        await userModel.findOneAndUpdate({username: request.body.username }, {characters: arrayCaratteri.characters});
        response.send(true);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.get("/squeals/squeal/reactions/number", async (request, response) => {
    try {
        //console.log("sono dentro a number reaction");
        //console.log("request.query.squealId number reaction:: " + request.query.squealId);
        //console.log("request.query.type number reaction:: " + request.query.reactionType);

        let number = await squealModel.findOne({_id: request.query.squealId}, {reactions: true});
        //console.log("number: --- " + number);
        let index = null;
        if(request.query.reactionType === "angry"){
            index = 0;
        }else if(request.query.reactionType === "dislike"){
            //console.log("è un dislike");
            index = 1;
        }else if(request.query.reactionType === "normal"){
            index = 2;
        }else if(request.query.reactionType === "like"){
            index = 3;
        }else if(request.query.reactionType === "heart"){
            index = 4;
        }else{
            console.log("errore");
            response.send("errore");
        }
        //console.log("lunghezza del vettore id:: " + number.reactions[index].usersIds.length);
        response.send(String(number.reactions[index].usersIds.length));
    } catch (error) {
        response.status(500).send(error);
    }
});


server.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});