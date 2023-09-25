import '../styles/Squeal.css';
import React, {useEffect, useRef} from 'react';
import {Link, Router, Route, useNavigate} from 'react-router-dom';
import {Context, router} from "../index";
import Profile from "../pages/Profile";
import Home from "../pages/Home";
import Tag from "./Tag";
import ReactDOM from "react-dom/client";
import {loadSqueals} from "./ScrollPane";
import MapContainer from "./MapContainer";
import {useState} from "react";
import {createRoot} from "react-dom/client";
import ReSquealModal from "./ReSquealModal";
import axios from "axios";
import {getServerDomain} from "../services/Config";
import {getUserPropic} from "../services/AccountManager";
import Spinner from "./Spinner";



function Squeal({from, username, propic, geo, img, text, id, date, resqueal}) {

    function squealBody(text, img, geo) {
        if(geo.length !== 0) {
            const pos = {lat: parseFloat(geo[0]), lng: parseFloat(geo[1])}
            return <div className='my-2'><MapContainer position={pos} mark={[pos]}/></div>;
        } else if(img !== "") {
            return <div className='d-flex justify-content-center my-2'><img src={img} className='col-12 col-md-6 p-0'/></div>
        } else {
            return <div className='fs-6 my-3 px-2' id='textContainer'>{checkForTags(text)}</div>;
        }
    }

    async function getSqueal() {
        try {
            const response = await axios.get(`https://${getServerDomain()}/squeal?squealId=${resqueal}`, {withCredentials: true});
            return(response);
        } catch (error) {
            console.error(error);
        }
    }

    const [resquealCheck, setResquealCheck] = useState();
    const [reactionCheck, setReactionCheck] = useState();
    useEffect(() => {
        async function retrieveResqueal() {
            setResquealCheck(await checkResqueal());
        }
        retrieveResqueal();
        async function retrieveCheckReaction(){
            setReactionCheck(await checkReaction(id, sessionStorage.getItem("username")));
        }
        retrieveCheckReaction();
    }, []);


    async function checkResqueal() {
        if (resqueal) {
            const squeal = await getSqueal(resqueal);
            return (
                <div className='container-fluid p-0 mb-3'>
                    <div className='row rounded-4 bg-secondary bg-opacity-25 p-2'>
                        <div className='col-12 d-flex'>
                            <div className='fs-6 ms-auto'>{formatDate(squeal.data.date)}</div>
                        </div>
                        <hr className='mt-0 mb-1'/>
                        <div className='col-12'>
                            <div className='row'>
                                <div className='col-2 col-md-1 pe-0 my-2'><img src={await getUserPropic(squeal.data.sender)} className='w-100'
                                                                               id='propic'/></div>
                                <div className='col-10 col-md-11 d-flex align-items-center'>
                                    <div className='fs-6 fw-semibold '>{squeal.data.sender}</div>
                                </div>
                            </div>
                        </div>
                        <div className='col-12'>
                            {squealBody(squeal.data.text, squeal.data.img, squeal.data.geolocation)}
                        </div>
                    </div>
                </div>
            );
        }
    }

    async function checkReaction(squealId, username) {
        const response = await axios.get(`https://${getServerDomain()}/squeals/squeal/${squealId}?username=${username}`, {withCredentials: true});
        if(response.data !== "unreacted"){
            document.getElementById(response.data + id).style.color = "#1DA0F2";
        }
    }

    async function onLikeButtonClick(l){
        let tipo = String(l);
        console.log("" + tipo);

        //await axios.put(`https://${getServerDomain()}/squealId_reaction?sender=${this.props.from}&text=${this.props.text}`)
        console.log("username passato: " + sessionStorage.getItem("username"));
        let user = sessionStorage.getItem("username");

        let tipi = ["like", "heart", "neutrale", "dislike", "angry"];

        console.log("prova id:: " + tipo + id);

        console.log("this.props.id:::: " + id);

        let color = document.getElementById(tipo + id).style.color;

        if(color === "blue"){
            document.getElementById(tipo + id).style.color = "#ADB5BD";
        }else{
            document.getElementById(tipo + id).style.color = "#1DA0F2";
            for(let i = 0; i < tipi.length; i++){
                console.log(tipi[i] + "  :  " + tipo);
                if(tipo !== tipi[i]){
                    document.getElementById(tipi[i] + id).style.color = "#ADB5BD";
                }
            }
        }

        axios.put(`https://${getServerDomain()}/add_reaction`, {
            reactionType: tipo,
            username: user,
            squealId: id
        },{ withCredentials: true })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return(
    <div className='container-fluid'>
        <div className='row rounded-4 bg-white p-2 ms-3 me-3'>
            <div className='col-12 d-flex'>
                <div className='fs-6'>{from !== undefined ? ['from: ', <Tag tagText={from}/>] : null}</div>
                <div className='fs-6 ms-auto'>{formatDate(date)}</div>
            </div>
            <hr className='mt-0 mb-1'/>
            <div className='col-12'>
                {resquealCheck ? resquealCheck : null}
            </div>
            <div className='col-12'>
                <div className='row'>
                    <div className='col-2 col-md-1 pe-0 my-2'><img src={propic} className='w-100' id='propic'/></div>
                    <div className='col-10 col-md-11 d-flex align-items-center'>
                        <div className='fs-6 fw-semibold '>{username}</div>
                    </div>
                </div>
            </div>
            <div className='col-12'>
                {squealBody(text, img, geo)}
            </div>
            <div className='col-12 d-flex'>
                <button className='btn postbox-btn me-auto' data-bs-toggle="modal" data-bs-target={'#' + 'resquealModal'+ id}><i className="bi bi-chat-left-quote-fill"></i></button>
                <div className='reactions' className='d-flex justify-content-center align-items-center gap-2'>
                    <i className="bi bi-emoji-angry reactionIcon fs-5" id={"angry" + id} onClick={() => onLikeButtonClick("angry")}/>

                    <i className="bi bi-hand-thumbs-down-fill reactionIcon fs-5" id={"dislike" + id} onClick={() => onLikeButtonClick("dislike")}/>

                    <i className="bi bi-emoji-neutral reactionIcon fs-5" id={"neutrale" + id} onClick={() => onLikeButtonClick("neutrale")}/>

                    <i className="bi bi-hand-thumbs-up-fill reactionIcon fs-5" id={"like" + id} onClick={() => onLikeButtonClick("like")}/>

                    <i className="bi bi-suit-heart-fill reactionIcon fs-5" id={"heart" + id} onClick={() => onLikeButtonClick("heart")}/>
                </div>
            </div>
            <ReSquealModal resquealModalId={'resquealModal'+ id} squealBody={squealBody(text, img, geo)} username={username} propic={propic} from={from} date={formatDate(date)} id={id}/>
        </div>
    </div>
    );
}

export function formatDate(date) {
    const squealDate = new Date(date);
    const now = new Date();
    const millisecondsDiff = now - squealDate;
    const secondsDiff = Math.floor(millisecondsDiff / 1000);
    const minutesDiff = Math.floor(secondsDiff / 60);
    const hoursDiff = Math.floor(minutesDiff / 60);

    if (hoursDiff >= 24) {
        // If the time difference is at least 24 hours, return just the date
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return squealDate.toLocaleDateString(undefined, options);
    } else if (hoursDiff >= 1) {
        // If the time difference is at least 1 hour, return hours and minutes
        const remainingMinutes = minutesDiff % 60;
        return `${hoursDiff}h ${remainingMinutes}m`;
    } else {
        // If the time difference is less than 1 hour, return just the minutes
        return `${minutesDiff}m`;
    }
}

export function checkForTags(text) {
    const regex = /\{\*tag\*\{([^}]+)\}\*tag\*\}/g;
    let lastIndex = 0;
    const components = [];

    text.replace(regex, (match, content, index) => {
        // Add the text between the previous match and the current match as a plain text component
        components.push(text.substring(lastIndex, index));

        // Create a Link component for the current match
        console.log(content);
        const tagText = content;

        components.push(
            <Tag tagText={tagText}/>
        );

        lastIndex = index + match.length;
    });

    // Add any remaining text after the last match
    components.push(text.substring(lastIndex));
    return components;
}

export default Squeal;