import '../styles/PostBox.css';
import {useEffect} from "react";
import axios from "axios";
import Tagify from '@yaireo/tagify';
import {getServerDomain} from "../services/Config";
import MapContainer from "./MapContainer";
import {createRoot} from "react-dom/client";
import {useState} from "react";
import Spinner from "./Spinner";
import {checkPropic} from "./Navbar";

function PostBox({update}) {
    const [propic, setPropic] = useState();
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

        var whitelist_1 = [], whitelist_2 = [];

        var inputText = document.getElementById('squealTextarea'),
            // init Tagify script on the above inputs
            tagifyText = new Tagify(inputText, {
                mixTagsInterpolator: ["{*tag*{", "}*tag*}"],
                enforceWhitelist: true,
                mode: 'mix',  // <--  Enable mixed-content
                pattern: /@|§/,  // <--  Text starting with @ or § (if single, String can be used here)
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

            if( prefix ){
                if( prefix === '@' ) {
                    fetch('https://localhost:3005/search_user?value=' + value)
                        .then(RES => RES.json())
                        .then(function(newWhitelist){
                            tagifyText.whitelist = newWhitelist // update whitelist Array in-place
                            tagifyText.loading(false).dropdown.show(value) // render the suggestions dropdown
                        })
                }
                if( prefix === '§' )
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

        async function retrievePropic() {
            setPropic(await checkPropic());
        }
        retrievePropic();
    })
    const [marker, setMarker] = useState([]);
    function onMapClick(e) {
        setMarker(() => [
            {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            }
        ]);
    };
    const [postType, setPostType] = useState(null);

    function getSquealBody() {
        if(postType === "geo"){
            return marker[0];
        } else if(postType === "img") {
            return document.getElementById('squealBodyImg').src;
        } else {
            return document.getElementById("squealTextarea").value;
        }
    }

    function postSqueal(postType, squealBody) {
        const receivers = document.getElementById('receivers').value;

        if(postType === "img") {
            axios.post(`https://${getServerDomain()}/post_squeal`, {
                img: squealBody,
                receivers: JSON.parse(receivers).map(user => user.value)
            }, {withCredentials: true})
                .then(function (response) {
                    console.log(response);
                    update(currentKey => currentKey+1);
                    document.getElementById("squealTextarea").value = "";
                    document.getElementById("receivers").value = "";
                    cancelImgBody();
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else if(postType === "geo") {
            axios.post(`https://${getServerDomain()}/post_squeal`, {
                geolocation: [squealBody.lat.toString(), squealBody.lng.toString()],
                receivers: JSON.parse(receivers).map(user => user.value)
            }, {withCredentials: true})
                .then(function (response) {
                    console.log(response);
                    update(currentKey => currentKey+1);
                    document.getElementById("squealTextarea").value = "";
                    document.getElementById("receivers").value = "";
                    cancelMapBody();
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            axios.post(`https://${getServerDomain()}/post_squeal`, {
                text: squealBody,
                receivers: JSON.parse(receivers).map(user => user.value)
            }, {withCredentials: true})
                .then(function (response) {
                    console.log(response);
                    update(currentKey => currentKey+1);
                    document.getElementById("squealTextarea").value = "";
                    document.getElementById("receivers").value = "";
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    return(
        <div className='container-fluid pt-4 pt-md-0 mt-5 mt-md-0'>
            <div className='row rounded-4 bg-white p-0 ms-3 me-3'>
                <div className='col-2 col-md-2 col-lg-2 p-3 d-none d-md-flex'>
                    <img src={ propic ? propic : <Spinner /> } className='w-100' id='propic'/>
                </div>
                <div className='col-12 col-md-9 col-lg-10 mb-3 mb-lg-1'>
                    <div className="input-group mb-0 mt-3">
                        <span className="input-group-text rounded-start-5 bg-transparent border-0" id="basic-addon1">to:</span>
                        <input type="text" className="form-control rounded-end-5 bg-transparent border-0" placeholder="@Username or §channel" aria-label="Username"
                               aria-describedby="basic-addon1" id='receivers' required/>
                    </div>
                    <textarea className="form-control bg-transparent border-0" aria-label="What's you want to squeal?" id="squealTextarea" placeholder="What's you want to squeal?" required></textarea>
                    <div className='col-12 p-0' id='squealAttachContainer'></div>
                    <div className='d-flex'>
                        <button className='btn postbox-btn' data-bs-toggle="modal" data-bs-target="#imgModal"><i className="bi bi-images"></i></button>
                        <button className='btn postbox-btn' data-bs-toggle="modal" data-bs-target="#mapModal"><i className="bi bi-geo-alt"></i></button>
                        <button className='btn btn-primary rounded-5 ms-auto' onClick={() => {postSqueal(postType,  getSquealBody())}}>Squeal<i className="bi bi-send-fill ms-2"></i></button>
                    </div>
                    <div className="modal fade" id="mapModal" tabIndex="-1" aria-labelledby="exampleModalLabel"
                         aria-hidden="true" data-backdrop="false">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Pick a place!</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div id="map"><MapContainer editable={true} mark={marker} onPick={(e) => {onMapClick(e)}}/></div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button z-1" className="btn btn-secondary"
                                            data-bs-dismiss="modal">Close
                                    </button>
                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => {pickLocation(marker, setPostType)}}>Post Geolocation</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal fade" id="imgModal" tabIndex="-1" aria-labelledby="exampleModalLabel"
                         aria-hidden="true" data-backdrop="false">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Pick an image!</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="col-12">
                                        <label htmlFor="squealImgUpload" className="form-label ps-3">Squeal Image</label>
                                        <input className="form-control rounded-5" type="file" id="squealImgUpload" name="squealImgUpload"
                                               accept=".jpg,.png" />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button z-1" className="btn btn-secondary"
                                            data-bs-dismiss="modal">Close
                                    </button>
                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => {pickImage(setPostType)}}>Post Image</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function resizeTextarea() {
    const textarea = document.getElementById('squealTextarea');
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
}

function pickImage(setPostType) {
    let selectedImage;
    if(document.getElementById('squealImgUpload')) {
        selectedImage = document.getElementById('squealImgUpload').files[0];
    }
    console.log(selectedImage);
    if(selectedImage) {
        if (!document.getElementById('squealTextarea').previousElementSibling.classList.contains('d-none')) {
            document.getElementById('squealTextarea').previousElementSibling.classList.add('d-none');
        }
        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);
        const root = createRoot(document.getElementById("squealAttachContainer"));
        setPostType('img');
        reader.onload = async function (event) {
            const encode_img = event.target.result;
            root.render(
                <div className='bg-dark p-3 rounded-5 mb-2'>
                    <div className='d-flex'>
                        <button className='ms-auto btn-close' onClick={() => {cancelImgBody(setPostType)}}/>
                    </div>
                    <img src={encode_img} id='squealBodyImg'/>
                </div>
            );
        };
    }
}

function cancelImgBody(setPostType) {
    if(document.getElementById('squealTextarea').previousElementSibling.classList.contains('d-none')){
        document.getElementById('squealTextarea').previousElementSibling.classList.remove('d-none');
    }
    document.getElementById("squealAttachContainer").removeChild(document.getElementById("squealAttachContainer").childNodes.item(0));
    setPostType('txt');
}

function pickLocation(position, setPostType) {
    if(position[0] !== undefined) {
        if (!document.getElementById('squealTextarea').previousElementSibling.classList.contains('d-none')) {
            document.getElementById('squealTextarea').previousElementSibling.classList.add('d-none');
        }
        const root = createRoot(document.getElementById("squealAttachContainer"));
        setPostType('geo');
        root.render(
            <div className='bg-dark p-3 rounded-5 mb-2'>
                <div className='d-flex'>
                    <button className='ms-auto btn-close' onClick={() => {cancelMapBody(setPostType)}}/>
                </div>
                <MapContainer position={{
                    lat: position[0].lat,
                    lng: position[0].lng
                }} editable={false} mark={[{
                    lat: position[0].lat,
                    lng: position[0].lng
                }]}/>
            </div>
        );
    }
}

function cancelMapBody(setPostType) {
    if(document.getElementById('squealTextarea').previousElementSibling.classList.contains('d-none')){
        document.getElementById('squealTextarea').previousElementSibling.classList.remove('d-none');
    }
    document.getElementById("squealAttachContainer").removeChild(document.getElementById("squealAttachContainer").childNodes.item(0));
    setPostType('txt');
}



export default PostBox;
