import axios from "axios";
import {getServerDomain} from "./Config";
import defaultPropic from "../img/default_propic.jpg"

export async function getUserPropic(username) {
    return await axios.get(`https://${getServerDomain()}/users/user/profilepic?username=${username}`)
        .then(function (response) {
            if(response.data) {
                return response.data;
            } else {
                return defaultPropic;
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}
