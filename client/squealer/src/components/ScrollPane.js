import '../styles/ScrollPane.css';
import PostBox from "./PostBox";
import axios from "axios";
import {getServerDomain} from "../services/Config";
import Squeal from "./Squeal";
import {getUserPropic} from "../services/AccountManager";
import { createRoot } from 'react-dom/client';
import ReactDOM from "react-dom/client";

function ScrollPane() {
    const logged = document.cookie.includes('loggedStatus');
    return(
        <div className='container-fluid' id='scrollpane-container'>
            <div className='row'>
                <div className='col-12 p-0' id='scrollpane'>
                    <div className='d-none d-md-block fw-bolder fs-6 text-white m-3'>Home</div>
                    <hr className='d-none d-md-block' />
                    { logged ? <PostBox /> : null}
                    <div className='container-fluid' id='squealContainer'></div>
                </div>
            </div>
        </div>
    );
}

function loadSqueals(root) {
    axios.get(`https://${getServerDomain()}/squeals`, { withCredentials: true })
        .then(async function (response) {
            console.log(response.data);
            let SquealsComponents = [];
            let keyCounter = 0;
            for (let entry of response.data) {
                console.log(entry.text);
                SquealsComponents.push(<Squeal key={keyCounter} from={entry.sender} propic={await getUserPropic(entry.sender)}
                                               username={entry.sender} text={entry.text}/>);
                keyCounter++;
            }
            root.render(SquealsComponents);
        })
        .catch(function (error) {
            console.log(error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const root = ReactDOM.createRoot(document.getElementById('squealContainer'));
        loadSqueals(root);
    }, 100); // Delay for 100 milliseconds (adjust as needed)
});

export default ScrollPane;