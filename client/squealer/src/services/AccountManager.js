import axios from "axios";
import {getServerDomain} from "./Config";

export async function getUserPropic(username) {
    return await axios.get(`https://${getServerDomain()}/propic_user?username=${username}`)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
}