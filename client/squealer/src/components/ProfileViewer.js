import '../styles/ProfileViewer.css';
import {getUserPropic} from "../services/AccountManager";
import {useEffect, useState} from "react";
import standardProPic from '../img/propic-stadard.svg';

function ProfileViewer() {
    const [propic, setPropic] = useState(null);
    let parameters = (new URL(document.location)).searchParams;
    let username = parameters.get("username");
    useEffect( () => {
        async function retrieveData() {
            setPropic(await getUserPropic(username))
        }

        retrieveData();
    }, []);
    return(
        <div className='container-fluid'>
            <div className='row d-flex justify-content-center'>
                <div className='col-3 mt-3 z-1' id='propicProfileV'>
                    {propic ? (
                        <img className='image w-100 rounded-circle' src={propic}/>
                    ) : (
                        <img src={standardProPic}/>)}
                    <div className='fs-3 text-center text-black'>{username}</div>
                </div>
                <div className='col-11 bg-white rounded-5 z-0'>
                    <div className='fs-3 text-center text-black'>Blablablablabla</div>
                </div>
            </div>
        </div>
    )
}

export default ProfileViewer;