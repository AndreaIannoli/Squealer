import '../styles/PostBox.css';
import {useEffect} from "react";
import axios from "axios";
import Tagify from '@yaireo/tagify';
import {getServerDomain} from "../services/Config";

function PostBox() {
    useEffect(() => {
        const textarea = document.getElementById('floatingTextarea');
        textarea.addEventListener('input', resizeTextarea);

        var input = document.getElementById('receivers'),
            tagify = new Tagify(input, {enforceWhitelist: true, whitelist:[]}),
            controller; // for aborting the call

        // listen to any keystrokes which modify tagify's input
        tagify.on('input', onInput)

        function onInput( e ){
            var value = e.detail.value
            tagify.whitelist = null // reset the whitelist

            // https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort

            controller = new AbortController();

            // show loading animation and hide the suggestions dropdown
            tagify.loading(true).dropdown.hide()

            fetch('https://localhost:3005/search?value=' + value, {signal:controller.signal})
                .then(RES => RES.json())
                .then(function(newWhitelist){
                    tagify.whitelist = newWhitelist // update whitelist Array in-place
                    tagify.loading(false).dropdown.show(value) // render the suggestions dropdown
                })
        }
    })

    return(
        <div className='container-fluid'>
            <div className='row rounded-4 bg-white p-0 ms-3 me-3'>
                <div className='col-2 col-md-2 col-lg-2 p-3 d-none d-md-flex'>
                    <img src={ sessionStorage.getItem('userPropic') } className='w-100' id='propic'/>
                </div>
                <div className='col-12 col-md-9 col-lg-10 mb-3 mb-lg-1'>
                    <div className="input-group mb-3">
                        <span className="input-group-text rounded-start-5" id="basic-addon1">to</span>
                        <input type="text" className="form-control rounded-end-5" placeholder="Username" aria-label="Username"
                               aria-describedby="basic-addon1" id='receivers'/>
                    </div>
                    <div className="form-floating">
                        <textarea className="form-control textarea-input no-border" id="floatingTextarea" placeholder="What's you want to squeal?"/>
                        <label htmlFor="floatingTextarea">What's you want to squeal?</label>
                    </div>
                    <div className='d-flex'>
                        <button className='btn postbox-btn'><i className="bi bi-images"></i></button>
                        <button className='btn postbox-btn'><i className="bi bi-geo-alt"></i></button>
                        <button className='btn btn-primary rounded-5 ms-auto' onClick={ postSqueal }>Squeal<i className="bi bi-send-fill ms-2"></i></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function resizeTextarea() {
    const textarea = document.getElementById('floatingTextarea');
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
}

function postSqueal() {
    const receivers = document.getElementById('receivers').value;
    console.log(JSON.parse(receivers).map(user => user));
    axios.post(`https://${getServerDomain()}/post_squeal`, {
        text: document.getElementById("floatingTextarea").value,
        receivers: JSON.parse(receivers).map(user => user.value)
    }, { withCredentials: true })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

export default PostBox;