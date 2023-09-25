import '../styles/ProfileViewer.css';
import {getUserPropic} from "../services/AccountManager";
import {useEffect, useState} from "react";
import standardProPic from '../img/propic-stadard.svg';
import axios from "axios";
import {getServerDomain} from "../services/Config";
import Squeal from "./Squeal";
import ReactDOM from "react-dom/client";
import {loadSqueals} from "./ScrollPane";
import Spinner from "./Spinner";
import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import BackToTop from "./BackToTop";

function ProfileViewer() {
    const navigate = useNavigate();
    const [squeals, setSqueals] = useState(null);
    const [owner, setOwner] = useState(null);
    const [subscribed, setSubscribed] = useState(null);
    let { name } = useParams();
    useEffect( () => {
        async function retrieveSqueals() {
            setSqueals(await loadChannelSqueals(name));
        }
        retrieveSqueals();
        async function retrieveOwnerCheck() {
            setOwner(await isOwner());
        }
        retrieveOwnerCheck();
        async function retrieveSubscriptionCheck() {
            setSubscribed(await isSubscribed());
        }
        retrieveSubscriptionCheck();
    }, []);

    async function getChannel() {
        try {
            return await axios.get(`https://${getServerDomain()}/channels/userChannels/${name}`, {withCredentials: true}).catch((e) => {
                if (e.response.status === 404) {
                    navigate("/error/404/channel%20not%20found");
                } else if(e.response.status === 403) {
                    navigate("/error/404/you%20are%20not%20allowed%20to%20enter%20this%20channel");
                }
            })
        } catch (e) {
            console.error(e);
        }
    }
    getChannel()

    async function isOwner(){
        const channel = await getChannel();
        if(channel.data.owners.includes(sessionStorage.getItem("username"))){
            return true;
        } else {
            return false;
        }
    }

    async function isSubscribed() {
        const response = await axios.get(`https://${getServerDomain()}/channels/${name}?username=${sessionStorage.getItem("username")}`, {withCredentials: true}).catch((e) => {
            console.log(e);
        });
        if(response.data === "Subscribed"){
            return true;
        } else {
            return false;
        }
    }

    async function subscribe() {
        await axios.post(`https://${getServerDomain()}/channels/subscribe`, {
            name: name
        }, {withCredentials: true}).catch((e) => {
            console.log(e);
        })
    }

    async function unsubscribe() {
        await axios.post(`https://${getServerDomain()}/channels/unsubscribe`, {
            name: name
        }, {withCredentials: true}).catch((e) => {
            console.log(e);
        })
    }
    return(
        <div className='container-fluid p-0 bg-dark'>
            <div className='row d-flex justify-content-center p-0 h-100'>
                <div className='col-12 d-flex flex-column align-items-center p-0' id='scrollpaneProfileV'>
                    <div id="anchorRelatedSqueals"/>
                    <div className='col-11 mx-3 mb-md-5 px-4 pt-5 pb-3 d-flex justify-content-center align-items-center bg-white rounded-bottom-5'>
                        <div className='fs-3 text-black text-center mt-5 mt-md-0 me-auto'>
                            {['§', name]}
                        </div>
                        {subscribed ? <button className='btn btn-secondary rounded-5 mt-5 mt-md-0 ' onClick={() => {unsubscribe()}}>Unsubscribe</button> : <button className='btn btn-primary rounded-5 mt-5 mt-md-0' onClick={() => {subscribe()}}>Subscribe</button>}
                    </div>

                    <div className='col-6 d-flex justify-content-center sticky-top pt-2 pt-md-0'>
                        <div className='bg-dark rounded-bottom-5 mt-5 mt-md-0 px-3 text-center opacity-75'>
                            Recent squeals
                        </div>
                    </div>

                    <div className='col-12 col-md-10 row gap-3 p-0' id='relatedSquealsContainer'>
                        {squeals ? squeals :
                            <Spinner/>
                        }
                    </div>
                    <BackToTop anchorId='anchorRelatedSqueals'/>
                </div>
            </div>
        </div>
    )
}

async function loadChannelSqueals(name) {
    try {
        const response = await axios.get(`https://${getServerDomain()}/channel_squeals?name=${name}`, { withCredentials: true });
        const SquealsComponents = [];

        for (let entry of response.data) {
            const propic = await getUserPropic(entry.sender);

            SquealsComponents.push(
                <Squeal
                    key={entry.id} // Consider using the unique entry ID as the key
                    from={entry.from}
                    propic={propic}
                    username={entry.sender}
                    geo={entry.geolocation}
                    img={entry.img}
                    text={entry.text}
                    id={entry.id}
                    date={entry.date}
                    resqueal={entry.resqueal}
                />
            );
        }

        return SquealsComponents;
    } catch (error) {
        console.error(error);
    }
}

export default ProfileViewer;