import '../styles/PostBox.css';
import {useEffect} from "react";
import axios from "axios";
import Tagify from '@yaireo/tagify';
import {getServerDomain} from "../services/Config";

function PostBox() {
    useEffect(() => {
        const textarea = document.getElementById('squealTextarea');
        textarea.addEventListener('input', resizeTextarea);

        var inputReceivers = document.getElementById('receivers'),
            tagifyReceivers = new Tagify(inputReceivers, {enforceWhitelist: true, whitelist:[], dropdown: {highlightFirst: true}}),
            controller; // for aborting the call

        // listen to any keystrokes which modify tagify's input
        tagifyReceivers.on('input', onInputReceivers)

        function onInputReceivers( e ){
            var value = e.detail.value
            tagifyReceivers.whitelist = null // reset the whitelist

            // https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort

            controller = new AbortController();

            // show loading animation and hide the suggestions dropdown
            tagifyReceivers.loading(true).dropdown.hide()

            fetch('https://localhost:3005/search?value=' + value, {signal:controller.signal})
                .then(RES => RES.json())
                .then(function(newWhitelist){
                    tagifyReceivers.whitelist = newWhitelist // update whitelist Array in-place
                    tagifyReceivers.loading(false).dropdown.show(value) // render the suggestions dropdown
                })
        }

        var whitelist_1 = ['@ciao', '#ciao'], whitelist_2 = [];

        var inputText = document.getElementById('squealTextarea'),
            // init Tagify script on the above inputs
            tagifyText = new Tagify(inputText, {
                mixTagsInterpolator: ["{*tag*{", "}*tag*}"],
                enforceWhitelist: true,
                mode: 'mix',  // <--  Enable mixed-content
                pattern: /@|#/,  // <--  Text starting with @ or # (if single, String can be used here)
                tagTextProp: 'text',  // <-- the default property (from whitelist item) for the text to be rendered in a tag element.
                originalInputValueFormat: tagData => tagData.value,
                // Array for initial interpolation, which allows only these tags to be used
                whitelist: whitelist_1.concat(whitelist_2).map(function(item){
                    return typeof item == 'string' ? {value:item} : item
                }),
                dropdown : {
                    enabled: 1,
                    position: 'text', // <-- render the suggestions list next to the typed text ("caret")
                    mapValueTo: 'text', // <-- similar to above "tagTextProp" setting, but for the dropdown items
                    highlightFirst: true  // automatically highlights first sugegstion item in the dropdown
                },
                callbacks: {
                    add: console.log,  // callback when adding a tag
                    remove: console.log   // callback when removing a tag
                }
            });

        // A good place to pull server suggestion list accoring to the prefix/value
        tagifyText.on('input', function(e){
            var prefix = e.detail.prefix;
            var value = e.detail.value;
            tagifyText.whitelist = null
            // first, clean the whitlist array, because the below code, while not, might be async,
            // therefore it should be up to you to decide WHEN to render the suggestions dropdown
            // tagify.settings.whitelist.length = 0;

            if( prefix ){
                if( prefix == '@' ) {
                    fetch('https://localhost:3005/search_user?value=' + value)
                        .then(RES => RES.json())
                        .then(function(newWhitelist){
                            tagifyText.whitelist = newWhitelist // update whitelist Array in-place
                            tagifyText.loading(false).dropdown.show(value) // render the suggestions dropdown
                        })
                }
                if( prefix == '#' )
                    fetch('https://localhost:3005/search_channel?value=' + value)
                        .then(RES => RES.json())
                        .then(function(newWhitelist){
                            tagifyText.whitelist = newWhitelist // update whitelist Array in-place
                            tagifyText.loading(false).dropdown.show(value) // render the suggestions dropdown
                        })

                if( e.detail.value.length > 1 )
                    tagifyText.dropdown.show(e.detail.value);
            }

            console.log( tagifyText.value )
            console.log('mix-mode "input" event value: ', e.detail)
        })
    })

    return(
        <div className='container-fluid pt-4 pt-md-0 mt-5 mt-md-0'>
            <div className='row rounded-4 bg-white p-0 ms-3 me-3'>
                <div className='col-2 col-md-2 col-lg-2 p-3 d-none d-md-flex'>
                    <img src={ sessionStorage.getItem('userPropic') } className='w-100' id='propic'/>
                </div>
                <div className='col-12 col-md-9 col-lg-10 mb-3 mb-lg-1'>
                    <div className="input-group mb-0 mt-3">
                        <span className="input-group-text rounded-start-5 bg-transparent border-0" id="basic-addon1">to:</span>
                        <input type="text" className="form-control rounded-end-5 bg-transparent border-0" placeholder="@Username or #channel" aria-label="Username"
                               aria-describedby="basic-addon1" id='receivers' required/>
                    </div>
                    <textarea className="form-control bg-transparent border-0" aria-label="What's you want to squeal?" id="squealTextarea" placeholder="What's you want to squeal?" required></textarea>
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
    const textarea = document.getElementById('squealTextarea');
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
}

function postSqueal() {
    console.log('valore' + document.getElementById("squealTextarea").value);
    const receivers = document.getElementById('receivers').value;
    console.log(JSON.parse(receivers).map(user => user));
    axios.post(`https://${getServerDomain()}/post_squeal`, {
        text: document.getElementById("squealTextarea").value,
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