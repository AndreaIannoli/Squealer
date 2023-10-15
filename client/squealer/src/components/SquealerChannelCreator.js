import React, {useEffect, useState} from "react";
import Tagify from '@yaireo/tagify';
import axios from "axios";
import {getServerDomain} from "../services/Config";
import {getUserPropic} from "../services/AccountManager";
import Squeal from "./Squeal";
import {useNavigate} from "react-router-dom";

function SquealerChannelCreator() {
    const [channelName, setChannelName] = useState('');
    const [channelDescription, setChannelDescription] = useState('');
    const [error, setError] = useState('');
    const [result, setResult] = useState('');

    const navigate = useNavigate();
    function createSquealerChannel() {
        axios.post(`https://${getServerDomain()}/channels/squealerChannels/` , {
            channelName: channelName,
            channelDescription: channelDescription
        }, {withCredentials: true}).then((response) => {
            setError('');
            setResult('Squealer channel created successfully');
        }).catch((e) => {
            setResult('')
            setError(e.response.data);
        });
    }
    return(
        <div className='container-fluid vh-100 d-flex align-items-center'>
            <div className='row d-flex justify-content-center'>
                <div className='col-12 text-center fs-3 text-white'>Create a SQUEALER channel</div>
                <div className='col-11 row col-md-8 col-lg-10 bg-white rounded-5 gap-3 p-3'>
                    <div className="input-group">
                        <span className="input-group-text rounded-start-5" id="basic-addon1">§</span>
                        <input type="text" className="form-control rounded-end-5 bg-transparent" placeholder="channelname" aria-label="channelname"
                               aria-describedby="basic-addon1" id='channelName' value={channelName} onChange={event => setChannelName(event.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlTextarea1">Channel description</label>
                        <textarea className="form-control bg-transparent rounded-4" id="exampleFormControlTextarea1" rows="3" value={channelDescription} onChange={event => setChannelDescription(event.target.value)}></textarea>
                    </div>
                    <div className='col-12 d-flex justify-content-center mt-3 mb-3'>
                        <button className='btn btn-primary rounded-5 fs-6 submit' onClick={() => {createSquealerChannel()}}>Create Squealer channel</button>
                    </div>
                    {error ?
                        <small className="text-danger">{error}</small>
                        :
                        (result ? <small className="text-success">{result}</small> : null)
                    }
                </div>
            </div>
        </div>
    )
}

export default SquealerChannelCreator;
