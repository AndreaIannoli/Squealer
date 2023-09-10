import '../styles/ScrollPane.css';
import PostBox from "./PostBox";
import axios from "axios";
import {getServerDomain} from "../services/Config";
import Squeal from "./Squeal";
import {getUserPropic} from "../services/AccountManager";
import { createRoot } from 'react-dom/client';
import ReactDOM from "react-dom/client";

let root;

function ScrollPane() {
    const logged = document.cookie.includes('loggedStatus');
    const page = window.location.pathname;
    setTimeout(function() {
        root = ReactDOM.createRoot(document.getElementById('squealsContainer'));
        loadSqueals();
    }, 100); // Delay for 100 milliseconds (adjust as needed)
    setTimeout(function() {
        document.getElementById('refresh').classList.remove('d-md-none');
        document.getElementById('refresh').classList.add('d-md-flex');
    }, 10000); // Delay for 30000 milliseconds (adjust as needed)
    return(
        <div className='container-fluid' id='scrollpane-container'>
            <div className='row'>
                <div className='col-12 p-0'>
                    <div className='row pt-3 pb-0 px-4 mt-0 d-none d-md-flex sticky-top bg-dark'>
                        <div className='col-10 d-none d-md-flex align-items-center'>
                            <div className='fw-bolder fs-6 text-white py-2'>{page === '/' ? 'Home' : page.charAt(1).toUpperCase() + page.slice(2)}</div>
                        </div>
                        <div className='col-2 d-none d-md-none justify-content-end align-items-center' id='refresh'>
                            <button className='btn p-0' onClick={ loadSqueals }><i className="bi bi-arrow-clockwise fs-4"></i></button>
                        </div>
                        <div className='col-12 p-0 d-none d-md-block'>
                            <hr className='d-none d-md-block' />
                        </div>
                    </div>
                    <div className="anchor" id="postBox"/>
                    <div className='row p-0' id='scrollpane'>
                        <div className='col-12 p-0'>
                            { logged ? <PostBox/> : null}
                        </div>
                        <div className='col-12 p-0'>
                            <div className='container-fluid mt-3' >
                                <div className='row gap-3' id='squealsContainer'>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function loadSqueals() {
    const page = window.location.pathname;
    const logged = document.cookie.includes('loggedStatus');
    if(page === '/' && logged){
        loadChannelsSqueals();
    } else if(page === '/') {
        loadPublicSqueals();
    } else {
        loadPrivateSqueals();
    }
}

function loadPublicSqueals() {
    axios.get(`https://${getServerDomain()}/channels_squeals`, { withCredentials: true })
        .then(async function (response) {
            let SquealsComponents = [];
            let keyCounter = 0;
            for (let entry of response.data) {
                console.log(entry.from);
                SquealsComponents.push(<Squeal key={keyCounter} from={entry.from} propic={await getUserPropic(entry.sender)}
                                               username={entry.sender} text={entry.text} id={entry.id} date={entry.date}/>);
                keyCounter++;
            }

            root.render(SquealsComponents);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function loadPrivateSqueals() {
    axios.get(`https://${getServerDomain()}/private_squeals`, { withCredentials: true })
        .then(async function (response) {
            let SquealsComponents = [];
            let keyCounter = 0;
            for (let entry of response.data) {
                console.log(entry.from);
                SquealsComponents.push(<Squeal key={keyCounter} from={entry.from} propic={await getUserPropic(entry.sender)}
                                               username={entry.sender} text={entry.text} id={entry.id} date={entry.date}/>);
                keyCounter++;
            }

            root.render(SquealsComponents);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function loadChannelsSqueals() {
    axios.get(`https://${getServerDomain()}/channels_squeals`, { withCredentials: true })
        .then(async function (response) {
            let SquealsComponents = [];
            let keyCounter = 0;
            for (let entry of response.data) {
                console.log(entry.from);
                SquealsComponents.push(<Squeal key={keyCounter} from={entry.from} propic={await getUserPropic(entry.sender)}
                                               username={entry.sender} text={entry.text} id={entry.id} date={entry.date}/>);
                keyCounter++;
            }

            root.render(SquealsComponents);
        })
        .catch(function (error) {
            console.log(error);
        });
}

export default ScrollPane;