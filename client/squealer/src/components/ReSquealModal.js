import React, {useEffect, useId, useRef} from "react";
import Tag from "./Tag";
import {resizeTextarea} from "./PostBox";
import Tagify from '@yaireo/tagify';
import axios from "axios";
import {getServerDomain} from "../services/Config";

function ReSquealModal({resquealModalId, squealBody, username, propic, from, date, id}) {
    const textAreaId = useId();
    useEffect(() => {
        var whitelist_1 = [], whitelist_2 = [];
        var inputText = document.getElementById(textAreaId),
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
            // tagify.settings.whitelist.length = 0;

            if( prefix ){
                if( prefix === '@' ) {
                    fetch('https://localhost:3005/users/user/search_user?value=' + value)
                        .then(RES => RES.json())
                        .then(function(newWhitelist){
                            tagifyText.whitelist = newWhitelist // update whitelist Array in-place
                            tagifyText.loading(false).dropdown.show(value) // render the suggestions dropdown
                        })
                }
                if( prefix === '§' )
                    fetch('https://localhost:3005/channels/channel/search_channel?value=' + value)
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
    }, []);
    return(
        <div className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel"
             aria-hidden="true" data-backdrop="false" id={resquealModalId}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content shadow">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Resqueal</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="col-12">
                            <div className='container-fluid pt-4 pt-md-0 mt-5 mt-md-0'>
                                <div className='row rounded-4 bg-white p-0 ms-3 me-3'>
                                    <div className='col-12 mb-3 mb-lg-1'>
                                        <div className='container-fluid p-0'>
                                            <div className='row rounded-4 bg-secondary bg-opacity-25 p-2'>
                                                <div className='col-12 d-flex'>
                                                    <div className='fs-6'>{from !== undefined ? ['from: ', <Tag tagText={from}/>] : null}</div>
                                                    <div className='fs-6 ms-auto'>{date}</div>
                                                </div>
                                                <hr className='mt-0 mb-1'/>
                                                <div className='col-12'>
                                                    <div className='row'>
                                                        <div className='col-2 col-md-2 pe-0 my-2'><img src={propic} className='w-100' id='propic'/></div>
                                                        <div className='col-10 col-md-10 d-flex align-items-center'>
                                                            <div className='fs-6 fw-semibold text-black'>{username}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-12 text-black'>
                                                    {squealBody}
                                                </div>
                                            </div>
                                        </div>
                                        <textarea className="form-control bg-transparent border-0 text-black" aria-label="What's you want to squeal?" id={textAreaId} placeholder="What's you want to squeal?" required></textarea>
                                        <div className='d-flex'>
                                            <button className='btn btn-primary rounded-5 ms-auto' data-bs-dismiss="modal" onClick={() => {postResqueal(document.getElementById(textAreaId).value, from, username, id)}}>Squeal<i className="bi bi-send-fill ms-2"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function postResqueal(resquealBody, from, sender, squealId) {
    let receiver;
    if(from){
        receiver = from;
    } else {
        receiver = '@' + sender;
    }
    console.log(receiver);

    axios.post(`https://${getServerDomain()}/squeals/squeal/post_resqueal`, {
        text: resquealBody,
        receivers: [receiver],
        resqueal: squealId
    }, {withCredentials: true})
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

export default ReSquealModal;
