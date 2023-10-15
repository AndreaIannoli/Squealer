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



function Squeal({from, username, propic, geo, img, text, id, date, resqueal, CM}) {

    let [admin, setAdmin] = useState();

    /*useEffect(() => {
        async function retriveAdmin(){
            setAdmin(await checkAdmin())
        }
        retriveAdmin();
    });

     */


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
            const response = await axios.get(`https://${getServerDomain()}/squeals?squealId=${resqueal}`, {withCredentials: true});
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
    async function checkAdmin(){
        return await axios.get(`https://${getServerDomain()}/users/user/admin`, {withCredentials: true})
            .then(response => {
                console.log("passa qui " )
                if (response.data === true) {
                    console.log("entri nel exist ?")
                    return "isAdmin";
                } else {
                    console.log("entri qua");
                    return "notAdmin";
                }
            }).catch(error => {
                console.log(error.message);

            });
    }

    async function onLikeButtonClick(l){
        let tipo = String(l);
        //console.log("" + tipo);
        //await axios.put(`https://${getServerDomain()}/squealId_reaction?sender=${this.props.from}&text=${this.props.text}`)
        //console.log("username passato: " + sessionStorage.getItem("username"));
        let user = sessionStorage.getItem("username");

        //fare la roba dell'admin
        let admin = await checkAdmin();
        console.log("admin:: " + admin);

        let tipi = ["like", "heart", "normal", "dislike", "angry"];
        //console.log("prova id:: " + tipo + id);
        //console.log("this.props.id:::: " + id);

        let color = document.getElementById(tipo + id).style.color;
        // funzione per convertire colore RGB in esadecimale
        function rgbToHex(rgb) {
            var esadecimale = Number(rgb).toString(16);
            if (esadecimale.length < 2) {
                esadecimale = "0" + esadecimale;
            }
            return esadecimale;
        }


        if(color === "blue"){
            document.getElementById(tipo + id).style.color = "#ADB5BD";
        }else{
            document.getElementById(tipo + id).style.color = "#1DA0F2";
            for(let i = 0; i < tipi.length; i++){
                //console.log(tipi[i] + "  :  " + tipo);
                if(tipo !== tipi[i]){
                    //console.log("prima dell'if: " + tipi[i]);
                    var coloreCalcolato = window.getComputedStyle(document.getElementById(tipi[i] + id)).color;
                    var arrayRgb = coloreCalcolato.match(/\d+/g);

                    // Converti ciascun componente RGB in esadecimale
                    var coloreEsadecimale = "#" + arrayRgb.map(function (x) {
                        return rgbToHex(x);
                    }).join("");

                    //console.log("coloreEsadecimale:: " + coloreEsadecimale);
                    if(admin === "notAdmin"){
                        if(coloreEsadecimale  === "#1da0f2"){
                            //console.log("cambio:: ");
                            if((parseInt(document.getElementById("span" + tipi[i] + id).innerText) - 1) === 0){
                                document.getElementById("span" + tipi[i] + id).innerText = "";
                            }else{
                                document.getElementById("span" + tipi[i] + id).innerText = String(parseInt(document.getElementById("span" + tipi[i] + id).innerText) - 1);
                            }
                            //console.log("cambio:: " + "span" + tipi[i]);
                        }
                        document.getElementById(tipi[i] + id).style.color = "#ADB5BD";
                    }


                }
            }
        }

        axios.put(`https://${getServerDomain()}/users/user/reactions/add_reaction`, {
            reactionType: tipo,
            username: user,
            squealId: id
        },{ withCredentials: true })
            .then(function (response) {
                console.log(response);
                giveNumberReactions(id, tipo);

            })
            .catch(function (error) {
                console.log(error);
            });

    }
    function ottieniIDSpan() {
        // Seleziona tutti gli elementi span sulla pagina
        var spanElements = document.querySelectorAll('span');

        spanElements.forEach(function(spanElement) {

            var spanID = spanElement.id;

            if(spanID.charAt(4) === 'a'){
                //console.log("angry   " +  spanID.substring(9, spanID.size));
                let idS = spanID.substring(9, spanID.length);
                giveNumberReactions(idS, "angry");
            }else if(spanID.charAt(4) === 'd'){
                //console.log("dislike   " +  spanID.substring(11, spanID.size));
                let idS = spanID.substring(11, spanID.length);
                giveNumberReactions(idS, "dislike");
            }else if(spanID.charAt(4) === 'n'){
                //console.log("normal   " +  spanID.substring(10, spanID.size));
                let idS = spanID.substring(10, spanID.length);
                console.log("id di normal: " + idS);
                giveNumberReactions(idS, "normal");
            }else if(spanID.charAt(4) === 'l'){
                //console.log("like   " +  spanID.substring(8, spanID.size));
                let idS = spanID.substring(8, spanID.length);
                giveNumberReactions(idS, "like");
            }else if(spanID.charAt(4) === 'h'){
                //console.log("heart   " +  spanID.substring(9, spanID.size));
                let idS = spanID.substring(9, spanID.length);
                giveNumberReactions(idS, "heart");
            }



        });
    }
    ottieniIDSpan();

    return(
    <div className='container-fluid'>
        <div className='row rounded-4 bg-white p-2 ms-3 me-3'>
            <div className='col-12 d-flex'>

                {CM === "popolare" ? (
                    <i className="bi bi-fire"></i>
                ) : CM == "impopolare" ? (
                    <i className="bi bi-graph-down-arrow"></i>
                ) : CM === "polarizzante" ? (
                    <i className="bi bi-arrows-angle-contract"></i>

                ) : (<i></i>)}

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
                        <div className='fs-6 fw-semibold text-black'>{username}</div>


                    </div>
                </div>
            </div>
            <div className='col-12 text-black'>
                {squealBody(text, img, geo)}
            </div>
            <div className='col-12 d-flex'>
                <button className='btn postbox-btn me-auto' data-bs-toggle="modal" data-bs-target={'#' + 'resquealModal'+ id}><i className="bi bi-chat-left-quote-fill"></i></button>


                <div className='reactions' className='d-flex justify-content-center align-items-center gap-2'>
                    <i className="bi bi-emoji-angry reactionIcon fs-5" id={"angry" + id} onClick={() => onLikeButtonClick("angry")}>
                        <span id={"spanangry" + id} className="position-relative top-100 start-0 translate-middle badge rounded-pill bg-danger">

                        </span>
                    </i>

                    <i className="bi bi-hand-thumbs-down-fill reactionIcon fs-5" id={"dislike" + id} onClick={() => onLikeButtonClick("dislike")}>
                        <span id={"spandislike" + id} className="position-relative top-100 start-0 translate-middle badge rounded-pill bg-danger">

                        </span>
                    </i>

                    <i className="bi bi-emoji-neutral reactionIcon fs-5" id={"normal" + id} onClick={() => onLikeButtonClick("normal")}>
                        <span id={"spannormal" + id} className="position-relative top-100 start-0 translate-middle badge rounded-pill bg-danger">

                        </span>
                    </i>

                    <i className="bi bi-hand-thumbs-up-fill reactionIcon fs-5" id={"like" + id} onClick={() => onLikeButtonClick("like")}>
                        <span id={"spanlike" + id} className="position-relative top-100 start-0 translate-middle badge rounded-pill bg-danger">

                        </span>
                    </i>

                    <i className="bi bi-suit-heart-fill reactionIcon fs-5" id={"heart" + id} onClick={() => onLikeButtonClick("heart")}>
                        <span id={"spanheart" + id} className="position-relative top-100 start-0 translate-middle badge rounded-pill bg-danger">

                        </span>
                    </i>
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

async function giveNumberReactions(id, tipo){
      return await axios.get(`https://${getServerDomain()}/squeals/squeal/reactions/number?squealId=${id}&reactionType=${tipo}`, {withCredentials: true})
        .then(response => {
                //console.log("response data:: " + response.data);
                //console.log("span" + tipo);
                if(response.data === 0){
                    document.getElementById("span" + tipo + id).innerHTML = "";
                }else{
                    document.getElementById("span" + tipo + id).innerHTML = response.data;
                }
            })
          .catch(error => {
                console.log(error.message);
          });
}

export default Squeal;
