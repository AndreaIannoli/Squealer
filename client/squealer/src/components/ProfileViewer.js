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
import ChangePasswordModal from "./ChangePasswordModal";


function ProfileViewer() {
    const [propic, setPropic] = useState(null);
    const [squeals, setSqueals] = useState(null);
    const { username } = useParams();
    let [block,setBlock] = useState();
    let [admin, setAdmin] = useState();
    const logged = document.cookie.includes('loggedStatus');
    if(!logged) {
        navigate('/');
    }
    useEffect( () => {
        async function retrieveSqueals() {
            setSqueals(await loadRelatedSqueals(username));
        }
        retrieveSqueals();
        async function retrieveData() {
            setPropic(await getUserPropic(username))
        }
        retrieveData();
        async function retrieveAdmin() {
            setAdmin(await checkAdmin());
        }
        retrieveAdmin();

        async function retrieveBlock() {
            setBlock(await checkBlock(username))
        }
        retrieveBlock();
    }, [username]);

    async function checkBlock(username){
        console.log(username);
        return await axios.get(`https://${getServerDomain()}/users/user/existence_block?username=${username}`)
            .then(response => {
                //console.log("passa qui " + sessionStorage.getItem('username') )
                if (response.data === "yes") {
                    console.log("Controllo che l,untente sia bloccato o meno ")
                    return "isBlocked";
                } else {
                    console.log("utente non bloccato");
                    return "notBlocked";
                }
            }).catch(error => {
                console.log(error.message);

            });
    }
    console.log(username)


    return(
        <div className='container-fluid p-0 bg-dark'>
            <div className='row d-flex justify-content-center p-0 h-100'>
                <div className='col-12 d-flex flex-column align-items-center p-0' id='scrollpaneProfileV'>
                    <div id="anchorRelatedSqueals"/>
                    <div className='col-11 mx-3 mb-3 pt-5 d-flex flex-column justify-content-center align-items-center bg-white rounded-bottom-5'>
                        {
                            sessionStorage.getItem('username')=== username ? (
                                <div id="changePassword" >
                                    <button id="btnChangePassword" data-bs-toggle="modal" className="btn btn-primary btn-circle rounded-5" data-bs-target={'#' + 'cambioPassword'}>Password Change</button>
                                </div>
                            ) :null
                        }
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
                        { admin === "isAdmin"?   <div className="d-flex justify-content-center gap-3 mb-3">
                            {block === "isBlocked" ? (
                                <button className="btn btn-secondary btn-circle rounded-5" onClick={()=>{unBlockUser(username); setBlock("notBlocked")}}>Sblocca</button>
                            ) : (
                                <button className="btn btn-primary btn-circle rounded-5" onClick={()=>{blockUser(username); setBlock("isBlocked")}}>Blocca</button>

                            )}
                            <button className="btn btn-primary btn-circle rounded-5" id="buttonCento" onClick={()=>{addCharacters(username,100)}}>Aggiungi 100 caratteri</button>
                            <button className="btn btn-primary btn-circle rounded-5" id="buttonDuecento" onClick={()=>{addCharacters(username,200)}}>Aggiungi 200 caratteri</button>
                            <button className="btn btn-primary btn-circle rounded-5" id="buttonCinquecento" onClick={()=>{addCharacters(username,500)}}>Aggiungi 500 caratteri</button>

                        </div> : null

                        }
                    </div>
                    <ChangePasswordModal changePassword={'cambioPassword'} username={username}/>
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
    return await axios.get(`https://${getServerDomain()}/squeals/squeal/related_squeals?username=${username}`, {withCredentials: true})
        .then(async function (response) {
            let SquealsComponents = [];
            let keyCounter = 0;
            for (let entry of response.data) {
                SquealsComponents.push(<Squeal key={keyCounter} from={entry.from}
                                               propic={await getUserPropic(entry.sender)}
                                               username={entry.sender} geo={entry.geolocation}
                                               img={entry.img} text={entry.text} id={entry.id}
                                               date={entry.date} resqueal={entry.resqueal} CM={entry.CM}/>);
                keyCounter++;
            }

            return SquealsComponents;
        })
        .catch(function (error) {
            console.log(error);
        });
}

async function checkAdmin(){

    return await axios.get(`https://${getServerDomain()}/users/user/admin`, {withCredentials: true})
        .then(response => {
            console.log("passa qui " )
            if (response.data === true) {
                console.log("Faccio il controllo che l'utente sia admin")
                return "isAdmin";
            } else {
                console.log("entri qua");
                return "notAdmin";
            }
        }).catch(error => {
            console.log(error.message);

        });
}
async function blockUser(username){

    return await axios.put(`https://${getServerDomain()}/users/user/block_user`, {
        username: username
    },{ withCredentials: true })
        .then(response => {
            if (response.data === true) {
                console.log("bloccato")
                return "blocked";
            }
        }).catch(error => {
            console.log(error.message);

        });
}
async function unBlockUser(username){

    return await axios.put(`https://${getServerDomain()}/users/user/unblock_user`, {
        username: username
    },{ withCredentials: true })
        .then(response => {
            if (response.data === true) {
                console.log("sbloccato")
                return "blocked";
            }
        }).catch(error => {
            console.log(error.message);

        });
}

async function addCharacters(username,values){

    return await axios.put(`https://${getServerDomain()}/users/user/charcters/add_characters`, {
        username: username,
        number: values

    },{ withCredentials: true })
        .then(response => {
            if (response.data === true) {
                console.log("aumento dei caratteri")
                return "updateChar";
            }
        }).catch(error => {
            console.log(error.message);

        });
}


export default ProfileViewer;
