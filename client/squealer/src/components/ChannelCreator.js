import React, {useEffect} from "react";
import Tagify from '@yaireo/tagify';
import axios from "axios";
import {getServerDomain} from "../services/Config";
import {getUserPropic} from "../services/AccountManager";
import Squeal from "./Squeal";
import {useNavigate} from "react-router-dom";

function ChannelCreator() {
    useEffect(() => {
        var inputReceivers = document.getElementById('owners'),
            tagifyReceivers = new Tagify(inputReceivers, {enforceWhitelist: true, whitelist:[], dropdown: {highlightFirst: true}}),
            controller; // for aborting the call

        // listen to any keystrokes which modify tagify's input
        tagifyReceivers.on('input', onInputOwners)

        function onInputOwners( e ){
            var value = e.detail.value
            tagifyReceivers.whitelist = null // reset the whitelist

            // https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort

            controller = new AbortController();

            // show loading animation and hide the suggestions dropdown
            tagifyReceivers.loading(true).dropdown.hide()

            fetch('https://localhost:3005/users/user/search_user?value=' + value, {signal:controller.signal})
                .then(RES => RES.json())
                .then(function(newWhitelist){
                    const username = '@' + sessionStorage.getItem('username');
                    tagifyReceivers.whitelist = newWhitelist.filter(listed => listed !== username); // update whitelist Array in-place
                    tagifyReceivers.loading(false).dropdown.show(value) // render the suggestions dropdown
                })
        }
    })

    const navigate = useNavigate();
    const createUserChannel = async (event) => {
        try {
            event.preventDefault();
            const existence = await axios.get(`https://${getServerDomain()}/channels/userChannels/existence?name=${document.getElementById('channelName').value}`, {withCredentials: true});
            if (existence.data === 'exist') {
                document.getElementById('channelName').classList.remove('is-valid');
                document.getElementById('channelName').classList.add('is-invalid');
                return;
            } else {
                document.getElementById('channelName').classList.remove('is-invalid');
                document.getElementById('channelName').classList.add('is-valid');
            }

            const owners = document.getElementById('owners').value;
            const channelName = document.getElementById('channelName').value.toLowerCase();
            axios.post(`https://${getServerDomain()}/channels/userChannels/`, {
                "name": channelName,
                "owners": owners ? JSON.parse(owners).map(user => user.value.slice(1)) : [],
                "access": document.getElementById('accessSwitch').checked ? 'private':'public',
            },{withCredentials: true}).then((res) => {
                navigate('/channels/' + channelName);
            }).catch(error => {
                console.log(error.message);
            });
        } catch (error) {
            console.error(error);
        }
    }
    return(
        <div className='container-fluid vh-100 d-flex align-items-center'>
            <div className='row d-flex justify-content-center'>
                <div className='col-12 text-center fs-3 text-white'>Create a channel</div>
                <form className='col-11 row col-md-8 col-lg-10 bg-white rounded-5 gap-3 p-3' onSubmit={createUserChannel}>
                    <div className="input-group">
                        <span className="input-group-text rounded-start-5" id="basic-addon1">§</span>
                        <input type="text" className="form-control rounded-end-5 bg-transparent" placeholder="channelname" aria-label="channelname"
                               aria-describedby="basic-addon1" id='channelName' required/>
                    </div>
                    <div className="input-group">
                        <span className="input-group-text rounded-start-5" id="basic-addon1">Owners</span>
                        <input type="text" className="form-control rounded-end-5 bg-transparent" placeholder="@Username" aria-label="Owners"
                               aria-describedby="basic-addon1" id='owners'/>
                    </div>
                    <div className='d-flex justify-content-center'>
                    <div className="fs-6">Public</div>
                        <div className="form-check form-switch ms-3 me-2">
                            <input className="form-check-input" type="checkbox" id="accessSwitch"/>
                        </div>
                        <div className="fs-6">Private</div>
                    </div>
                    <div className='col-12 d-flex justify-content-center mt-3 mb-3'>
                        <button className='btn btn-primary rounded-5 fs-6 submit' type='submit'>Create channel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChannelCreator;
