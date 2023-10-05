import '../styles/ScrollPane.css';
import PostBox from "./PostBox";
import axios from "axios";
import {getServerDomain} from "../services/Config";
import Squeal from "./Squeal";
import {getUserPropic} from "../services/AccountManager";
import {useEffect, useReducer} from "react";
import React from "react";
import {useState} from "react";
import Spinner from "./Spinner";
import BackToTop from "./BackToTop";
import {Link} from "react-router-dom";

function ScrollPane() {
    const [squeals, setSqueals] = useState(null);
    const [key, forceUpdate] = useState(0);
    const logged = document.cookie.includes('loggedStatus');
    const page = window.location.pathname;
    useEffect(() => {
        async function retrieveSqueals() {
            setSqueals(await loadSqueals());
        }
        retrieveSqueals();
        setTimeout(function() {
            if(document.getElementById('refresh') !== null) {
                document.getElementById('refresh').classList.remove('d-md-none');
                document.getElementById('refresh').classList.add('d-md-flex');
            }
        }, 10000); // Delay for 30000 milliseconds (adjust as needed)
    }, [key]);
    return(
        <div className='container-fluid overflow-x-hidden bg-dark' id='scrollpane-container'>
            <div className='row'>
                <div className='col-12 p-0'>
                    <div className='row pt-3 pb-0 px-4 mt-0 d-none d-md-flex sticky-top bg-dark'>
                        <div className='col-10 d-none d-md-flex align-items-center'>
                            <div className='fw-bolder fs-6 text-white py-2'>{page === '/' ? 'Home' : page.charAt(1).toUpperCase() + page.slice(2)}</div>
                        </div>
                        <div className='col-2 d-none d-md-none justify-content-end align-items-center' id='refresh'>
                            <button className='btn p-0' onClick={ () => forceUpdate(currentKey => currentKey+1) }><i className="bi bi-arrow-clockwise fs-4"></i></button>
                        </div>
                        <div className='col-12 p-0 d-none d-md-block'>
                            <hr className='d-none d-md-block' />
                        </div>
                    </div>
                    <div className="anchor" id="postBox"/>
                    <div className='row p-0' id='scrollpane'>
                        <div className='col-12 p-0'>
                            { logged ? <PostBox update={forceUpdate}/> : null}
                        </div>
                        {checkIfExplore()}
                        <div className='col-12 p-0'>
                            <div className='container-fluid mt-3' >
                                <div className='row gap-3' id='squealsContainer' key={key}>
                                    {squeals ? squeals :
                                        <Spinner/>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <BackToTop anchorId='postBox'/>
                </div>
            </div>
        </div>
    );
}

export async function loadSqueals() {
    const page = window.location.pathname;
    const logged = document.cookie.includes('loggedStatus');
    if (page === '/' && logged) {
        return await loadChannelsSqueals();
    } else if (page === '/') {
        return await loadPublicSqueals();
    } else {
        return await loadPrivateSqueals();
    }
}

async function loadPublicSqueals() {
    try {
        const response = await axios.get(`https://${getServerDomain()}/channels_squeals`, { withCredentials: true });
        const SquealsComponents = [];

        for (let entry of response.data) {
            const propic = await getUserPropic(entry.sender);

            SquealsComponents.push(
                <Squeal
                    key={entry.id}
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


async function loadPrivateSqueals() {
    try {
        const response = await axios.get(`https://${getServerDomain()}/private_squeals`, { withCredentials: true });
        const SquealsComponents = [];

        for (let entry of response.data) {
            const propic = await getUserPropic(entry.sender);
            console.log('id caricato' ,entry.id)

            SquealsComponents.push(
                <Squeal
                    key={entry.id}
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


async function loadChannelsSqueals() {
    try {
        const response = await axios.get(`https://${getServerDomain()}/channels_squeals`, { withCredentials: true });
        const SquealsComponents = [];

        for (let entry of response.data) {
            const propic = await getUserPropic(entry.sender);
            SquealsComponents.push(
                <Squeal
                    key={entry.id}
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

function checkIfExplore() {
    const logged = document.cookie.includes('loggedStatus');
    if(logged && window.location.pathname === '/explore') {
        return(
            <div className='col-12 d-flex justify-content-center align-items-center p-0'>
                <Link to='/channel_creation' className='btn btn-primary rounded-bottom-5 w-75'>Create a channel</Link>
            </div>
        )
    }
}

export default ScrollPane;
