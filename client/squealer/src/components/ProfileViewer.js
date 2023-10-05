import '../styles/ProfileViewer.css';
import {getUserPropic} from "../services/AccountManager";
import {useEffect, useState} from "react";
import axios from "axios";
import {getServerDomain} from "../services/Config";
import Squeal from "./Squeal";
import ReactDOM from "react-dom/client";
import {loadSqueals} from "./ScrollPane";
import Spinner from "./Spinner";
import React from "react";
import {useLocation, useParams} from "react-router-dom";
import BackToTop from "./BackToTop";

function ProfileViewer() {
    const [propic, setPropic] = useState(null);
    const [squeals, setSqueals] = useState(null);
    const { username } = useParams();
    useEffect( () => {
        async function retrieveSqueals() {
            setSqueals(await loadRelatedSqueals(username));
        }
        retrieveSqueals();
        async function retrieveData() {
            setPropic(await getUserPropic(username))
        }
        retrieveData();
    }, [username]);
    return(
        <div className='container-fluid p-0 bg-dark'>
            <div className='row d-flex justify-content-center p-0 h-100'>
                <div className='col-12 d-flex flex-column align-items-center p-0' id='scrollpaneProfileV'>
                    <div id="anchorRelatedSqueals"/>
                    <div className='col-11 mx-3 mb-3 pt-5 d-flex flex-column justify-content-center align-items-center bg-white rounded-bottom-5'>
                        <div className='col-3 z-2 mt-3 mt-md-0' id='propicContainerProfileV'>
                            {propic ? (
                                <img className='image w-100 rounded-circle shadow' src={propic} id='propicProfileV'/>
                            ) : (
                                <Spinner/>)}
                        </div>
                        <div className='col-11 z-1 px-3 mb-2'>
                            <div className='fs-3 text-black text-center'>
                                {username}
                            </div>
                        </div>
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

async function loadRelatedSqueals(username) {
    return await axios.get(`https://${getServerDomain()}/related_squeals?username=${username}`, {withCredentials: true})
        .then(async function (response) {
            let SquealsComponents = [];
            let keyCounter = 0;
            for (let entry of response.data) {
                SquealsComponents.push(<Squeal key={keyCounter} from={entry.from}
                                               propic={await getUserPropic(entry.sender)}
                                               username={entry.sender} geo={entry.geolocation}
                                               img={entry.img} text={entry.text} id={entry.id}
                                               date={entry.date} resqueal={entry.resqueal}/>);
                keyCounter++;
            }

            return SquealsComponents;
        })
        .catch(function (error) {
            console.log(error);
        });
}

export default ProfileViewer;
