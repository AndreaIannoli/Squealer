import '../styles/ProfileViewer.css';
import {getUserPropic} from "../services/AccountManager";
import {useEffect, useId, useRef, useState} from "react";
import axios from "axios";
import {getServerDomain} from "../services/Config";
import Squeal from "./Squeal";
import Spinner from "./Spinner";
import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import BackToTop from "./BackToTop";
import {checkAdmin} from "./Navbar";

function ChannelViewer() {
    const navigate = useNavigate();
    let { name } = useParams();
    const logged = document.cookie.includes('loggedStatus');
    if(!logged) {
        navigate('/');
    }
    async function getChannel() {
        try {
            return await axios.get(`https://${getServerDomain()}/channels/${name}`, {withCredentials: true}).catch((e) => {
                if (e.response.status === 404) {
                    navigate("/error/404/channel%20not%20found");
                } else if(e.response.status === 403) {
                    navigate("/error/404/you%20are%20not%20allowed%20to%20enter%20this%20channel");
                }
            })
        } catch (e) {
            console.error(e);
        }
    }
    const [squeals, setSqueals] = useState(null);
    const [owner, setOwner] = useState(null);
    const [subscribed, setSubscribed] = useState(null);
    const modalId = useId();
    const [toPromote, setToPromote] = useState([]);
    const [userToPromote, setUserToPromote] = useState('');
    const [toPromoteError, setToPromoteError] = useState('');
    const [toPromoteResult, setToPromoteResult] = useState('');
    const [owners, setOwners] = useState([]);
    const [userToPromoteWriter, setUserToPromoteWriter] = useState('');
    const [toPromoteWriterError, setToPromoteWriterError] = useState('');
    const [toPromoteWriterResult, setToPromoteWriterResult] = useState('');
    const [writers, setWriters] = useState([]);
    const [userToAddMember, setUserToAddMember] = useState('');
    const [toAddMemberError, setToAddMemberError] = useState('');
    const [toAddMemberResult, setToAddMemberResult] = useState('');
    const [userToRemoveMember, setUserToRemoveMember] = useState('');
    const [toRemoveMemberError, setToRemoveMemberError] = useState('');
    const [toRemoveMemberResult, setToRemoveMemberResult] = useState('');
    const [writingRestriction, setWritingRestriction] = useState(false);
    const [privacy, setChannelPrivacy] = useState('');
    const [squealerChannel, setSquealerChannel] = useState('');
    const [adminUser, setAdminUser] = useState(false);
    const [channelDescription, setChannelDescription] = useState('');
    const [channelDesResult, setChannelDesResult] = useState('');
    const [channelDesError, setChannelDesError] = useState('');
    async function retrieveUserToPromote() {
        setToPromote(await searchUserToPromote());
    }
    useEffect( () => {
        async function checkChannel() {await getChannel();}
        checkChannel().then((r) => {
            async function retrieveSqueals() {
                setSqueals(await loadChannelSqueals(name));
            }
            retrieveSqueals();
            async function retrieveOwnerCheck() {
                setOwner(await isOwner());
            }
            retrieveOwnerCheck();
            async function retrieveSubscriptionCheck() {
                setSubscribed(await isSubscribed());
            }
            async function retrieveWritingRestriction() {
                const channel = await getChannel();
                setWritingRestriction(channel.data.writingRestriction);
            }
            async function retrievePrivacy() {
                const channel = await getChannel();
                setChannelPrivacy(channel.data.access === 'private');
            }
            async function retrieveSquealerChannel() {
                const channel = await getChannel();
                setSquealerChannel(channel.data.channelType === 'squealer');
                setChannelDescription(channel.data.description);
            }
            async function retrieveAdminUser() {
                setAdminUser((await checkAdmin()) === 'isAdmin');
            }
            retrieveAdminUser();
            retrieveSquealerChannel();
            retrievePrivacy();
            retrieveWritingRestriction();
            retrieveSubscriptionCheck();
            retrieveUserToPromote();
            getOwnersList();
            getWritersList();
            resetNav();
        });
    }, [name]);

    async function isOwner(){
        const channel = await getChannel();
        if(channel.data.owners.includes(sessionStorage.getItem("username"))){
            return true;
        } else {
            return false;
        }
    }

    async function isSubscribed() {
        const response = await axios.get(`https://${getServerDomain()}/channels/${name}?username=${sessionStorage.getItem("username")}`, {withCredentials: true}).catch((e) => {
            console.log(e);
        });
        if(response.data === "Subscribed"){
            return true;
        } else {
            return false;
        }
    }

    async function subscribe() {
        await axios.post(`https://${getServerDomain()}/channels/subscribe`, {
            name: name
        }, {withCredentials: true}).then((res) => {
            setSubscribed(true);
        }).catch((e) => {
            console.log(e);
        })
    }

    async function unsubscribe() {
        await axios.post(`https://${getServerDomain()}/channels/unsubscribe`, {
            name: name
        }, {withCredentials: true}).then((res) => {
            setSubscribed(false);
            setOwner(false);
        }).catch((e) => {
            console.log(e);
        })
    }

    async function searchUserToPromote() {
        const response = await axios.get(`https://${getServerDomain()}/users/user/search_user?value=${userToPromote}`, {withCredentials: true});
        const usernameOptions = [];
        for(let username of response.data) {
            usernameOptions.push(<option value={username.slice(1)}/>);
        }
        return usernameOptions;
    }

    async function promoteToOwner() {
        await axios.post(`https://${getServerDomain()}/channels/userChannels/userChannel/owners`, {
            channelName: name,
            toPromote: userToPromote
        }, {withCredentials: true}).then((response) => {
            setToPromoteError('');
            setToPromoteResult('User promoted');
            getOwnersList();
        }).catch((error) => {
            setToPromoteResult('');
            setToPromoteError(error.response.data);
            console.log(error);
        })
    }


    async function removeOwner(userToDepromote) {
        await axios.post(`https://${getServerDomain()}/channels/userChannels/userChannel/owners/depromote`, {
            channelName: name,
            toDepromote: userToDepromote
        }, {withCredentials: true}).then((response) => {
            getOwnersList();
        }).catch((error) => {
            console.log(error);
        })
    }

    async function getOwnersList() {
        const channel = await getChannel();
        let users = [];
        for(let entry of channel.data.owners) {
            users.push(<div className="col-12 d-flex bg-dark-subtle rounded-5 flex-row align-items-center gap-2 p-3">
                <img className="col-1 rounded-circle" src={await getUserPropic(entry)}/>
                <small className="text-body">{entry}</small>
                <button className="ms-auto btn-close btn-close-white" onClick={() => {removeOwner(entry);}}/>
            </div>);
        }
        setOwners(users);
    }

    async function promoteToWriter() {
        console.log(userToPromoteWriter);
        await axios.post(`https://${getServerDomain()}/channels/userChannels/userChannel/writers`, {
            channelName: name,
            toAdd: userToPromoteWriter
        }, {withCredentials: true}).then((response) => {
            setToPromoteWriterError('');
            setToPromoteWriterResult('User promoted to writer');
            getWritersList();
        }).catch((error) => {
            setToPromoteWriterResult('');
            setToPromoteWriterError(error.response.data);
            console.log(error);
        })
    }

    async function removeWriter(userToDepromote) {
        await axios.post(`https://${getServerDomain()}/channels/userChannels/userChannel/writers/depromote`, {
            channelName: name,
            toRemove: userToDepromote
        }, {withCredentials: true}).then((response) => {
            getWritersList();
        }).catch((error) => {
            console.log(error);
        })
    }

    async function getWritersList() {
        const channel = await getChannel();
        let users = [];
        for(let entry of channel.data.writers) {
            users.push(<div className="col-12 d-flex bg-dark-subtle rounded-5 flex-row align-items-center gap-2 p-3">
                <img className="col-1 rounded-circle" src={await getUserPropic(entry)}/>
                <small className="text-body">{entry}</small>
                <button className="ms-auto btn-close btn-close-white" onClick={() => {removeWriter(entry);}}/>
            </div>);
        }
        setWriters(users);
    }

    async function removeMember() {
        await axios.post(`https://${getServerDomain()}/channels/userChannels/userChannel/members/remove`, {
            channelName: name,
            toRemove: userToRemoveMember
        }, {withCredentials: true}).then((response) => {
            setToRemoveMemberError('');
            setToRemoveMemberResult('User removed from members');
        }).catch((error) => {
            setToRemoveMemberResult('');
            setToRemoveMemberError(error.response.data);
            console.log(error);
        })
    }

    async function addMember() {
        await axios.post(`https://${getServerDomain()}/channels/userChannels/userChannel/members`, {
            channelName: name,
            toAdd: userToAddMember
        }, {withCredentials: true}).then((response) => {
            setToAddMemberError('');
            setToAddMemberResult('User added to members');
        }).catch((error) => {
            setToAddMemberResult('');
            setToAddMemberError(error.response.data);
            console.log(error);
        })
    }

    async function setPrivacy(value) {
        await axios.post(`https://${getServerDomain()}/channels/userChannels/userChannel/privacy`, {
            channelName: name,
            privacy: value ? 'private' : 'public'
        }, {withCredentials: true}).then((response) => {
            setChannelPrivacy(value);
        }).catch((error) => {
            console.log(error);
        })
    }

    async function setChannelWritingRestriction(value) {
        await axios.post(`https://${getServerDomain()}/channels/userChannels/userChannel/writingrestriction`, {
            channelName: name,
            value: value
        }, {withCredentials: true}).then((response) => {
            setWritingRestriction(value);
        }).catch((error) => {
            console.log(error);
        })
    }

    async function updateDescription() {
        await axios.post(`https://${getServerDomain()}/channels/squealerChannels/squealerChannel/description`, {
            channelName: name,
            channelDescription: channelDescription
        }, {withCredentials: true}).then((response) => {
            setChannelDesError('');
            setChannelDesResult('Description update');
        }).catch((error) => {
            setChannelDesResult('');
            setChannelDesError(error.response.data);
            console.log(error);
        })
    }

    return(
        <div className='container-fluid p-0 bg-dark'>
            <div className='row d-flex justify-content-center p-0 h-100'>
                <div className='col-12 d-flex flex-column align-items-center p-0' id='scrollpaneProfileV'>
                    <div id="anchorRelatedSqueals"/>
                    <div className='col-11 mx-3 mb-md-5 px-4 pt-5 pb-3 d-flex justify-content-center align-items-center bg-white rounded-bottom-5 gap-3'>
                        <div className='fs-3 text-black text-center mt-5 mt-md-0 me-auto'>
                            {['§', name]}
                        </div>
                        {owner || adminUser ?
                            <button className='btn btn-primary rounded-5 mt-5 mt-md-0 ' data-bs-toggle="modal" data-bs-target={'[id="' + modalId + '"]'}>Moderate Channel</button>
                            : null}
                        {owner || adminUser ?
                            <div className="modal fade" tabIndex="-1" aria-labelledby="modalChannelModeration"
                                 aria-hidden="true" data-backdrop="false" id={modalId}>
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content shadow">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="modalChannelModerationLabel">Moderate Channel</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                                    aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            {squealerChannel && adminUser ? null :
                                                <div className='col-12 d-flex justify-content-center mt-2'>
                                                    <div className="fs-6">Public</div>
                                                    <div className="form-check form-switch ms-3 me-2">
                                                        <input className="form-check-input" type="checkbox" id="privacySwitch" checked={privacy} onChange={event => setPrivacy(event.target.checked)}/>
                                                    </div>
                                                    <div className="fs-6">Private</div>
                                                </div>}
                                            {squealerChannel && adminUser ? null :
                                                <div className='col-12 d-flex justify-content-center my-3'>
                                                    <div className="fs-6">free writing</div>
                                                    <div className="form-check form-switch ms-3 me-2">
                                                        <input className="form-check-input" type="checkbox" id="writingRestrictionSwitch" checked={writingRestriction} onChange={event => setChannelWritingRestriction(event.target.checked)}/>
                                                    </div>
                                                    <div className="fs-6">writing restricted</div>
                                                </div>
                                            }

                                            <nav>
                                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                    <button className="nav-link active" id="nav-description-tab" data-bs-toggle="tab" data-bs-target="#nav-description" type="button" role="tab" aria-controls="nav-members" aria-selected="true">Description</button>
                                                    {squealerChannel && adminUser ? null :
                                                        <button className="nav-link" id="nav-owners-tab" data-bs-toggle="tab" data-bs-target="#nav-owners" type="button" role="tab" aria-controls="nav-owners" aria-selected="false">Owners</button>
                                                    }
                                                    {squealerChannel && adminUser ? null :
                                                        (
                                                            writingRestriction ?
                                                                <button className="nav-link" id="nav-writers-tab" data-bs-toggle="tab" data-bs-target="#nav-writers" type="button" role="tab" aria-controls="nav-writers" aria-selected="false">Writers</button>
                                                                :
                                                                null
                                                        )
                                                    }
                                                    {squealerChannel && adminUser ? null :
                                                        <button className="nav-link" id="nav-members-tab" data-bs-toggle="tab" data-bs-target="#nav-members" type="button" role="tab" aria-controls="nav-members" aria-selected="false">Add member</button>
                                                    }
                                                </div>
                                            </nav>

                                            <div className="tab-content">
                                                <div className="tab-pane fade show active" role="tabpanel" id="nav-description">
                                                    <div className='col-12 d-flex flex-column'>
                                                        <label htmlFor="exampleFormControlTextarea1" className='mt-2'>Channel description</label>
                                                        <textarea className="form-control bg-transparent rounded-4" id="exampleFormControlTextarea1" rows="3" value={channelDescription} onChange={event => setChannelDescription(event.target.value)}></textarea>
                                                        <button className='btn btn-primary rounded-5 mt-3' onClick={() => {updateDescription()}}>Update</button>
                                                        {channelDesError ?
                                                            <small className="text-danger">{channelDesError}</small>
                                                            :
                                                            (channelDesResult ? <small className="text-success">{channelDesResult}</small> : null)
                                                        }
                                                    </div>
                                                </div>
                                                <div className="tab-pane fade" role="tabpanel" id="nav-owners">
                                                    <div className="col-12">
                                                        <label htmlFor="ownerModerationListInput" className="form-label">Promote to owner</label>
                                                        <input className="form-control" list="datalistOptions" id="ownerModerationListInput" placeholder="Type to search User to promote..." value={userToPromote} onChange={event => {setUserToPromote(event.target.value); retrieveUserToPromote()}}/>
                                                        <datalist id="datalistOptions">
                                                            {
                                                                toPromote
                                                            }
                                                        </datalist>
                                                        <div className="col-12">
                                                            {toPromoteError ?
                                                                <small className="text-danger">{toPromoteError}</small>
                                                                :
                                                                (toPromoteResult ? <small className="text-success">{toPromoteResult}</small> : null)
                                                            }
                                                        </div>
                                                        <button className="btn btn-primary rounded-5 mt-2" onClick={() => {promoteToOwner(); setUserToPromote(''); getOwnersList()}}>Promote</button>
                                                        <div className="fs-6 mt-3 mb-1">Channel owners</div>
                                                        <div className="col-12 rounded-5 vh-50 overflow-y-scroll d-flex flex-column gap-2">
                                                            {owners}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="tab-pane fade" role="tabpanel" id="nav-writers">
                                                    <div className="col-12">
                                                        <label htmlFor="writerModerationListInput" className="form-label">Promote to writer</label>
                                                        <input className="form-control" list="datalistOptions" id="writerModerationListInput" placeholder="Type to search User to promote..." value={userToPromoteWriter} onChange={event => {setUserToPromoteWriter(event.target.value); retrieveUserToPromote()}}/>
                                                        <datalist id="datalistOptions">
                                                            {
                                                                toPromote
                                                            }
                                                        </datalist>
                                                        <div className="col-12">
                                                            {toPromoteWriterError ?
                                                                <small className="text-danger">{toPromoteWriterError}</small>
                                                                :
                                                                (toPromoteWriterResult ? <small className="text-success">{toPromoteWriterResult}</small> : null)
                                                            }
                                                        </div>
                                                        <button className="btn btn-primary rounded-5 mt-2" onClick={() => {promoteToWriter(); setUserToPromoteWriter(''); getWritersList();}}>Promote</button>
                                                        <div className="fs-6 mt-3 mb-1">Channel writers:</div>
                                                        <div className="col-12 rounded-5 vh-50 overflow-y-scroll d-flex flex-column gap-2">
                                                            {writers.length > 0 ? writers : 'There\'s no writer'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="tab-pane fade" role="tabpanel" id="nav-members">
                                                    <div className="col-12">
                                                        <label htmlFor="memberModerationListInput" className="form-label">Add member</label>
                                                        <input className="form-control" list="datalistOptions" id="memberModerationListInput" placeholder="Type to search User to promote..." value={userToAddMember} onChange={event => {setUserToAddMember(event.target.value); retrieveUserToPromote()}}/>
                                                        <datalist id="datalistOptions">
                                                            {
                                                                toPromote
                                                            }
                                                        </datalist>
                                                        <div className="col-12">
                                                            {toAddMemberError ?
                                                                <small className="text-danger">{toAddMemberError}</small>
                                                                :
                                                                (toAddMemberResult ? <small className="text-success">{toAddMemberResult}</small> : null)
                                                            }
                                                        </div>
                                                        <button className="btn btn-primary rounded-5 mt-2" onClick={() => {addMember(); setUserToAddMember('');}}>Add Member</button>
                                                        <div htmlFor="memberRModerationListInput" className="form-label mt-4">Remove member</div>
                                                        <input className="form-control" list="datalistOptions" id="memberRModerationListInput" placeholder="Type to search User to promote..." value={userToRemoveMember} onChange={event => {setUserToRemoveMember(event.target.value); retrieveUserToPromote()}}/>
                                                        <datalist id="datalistOptions">
                                                            {
                                                                toPromote
                                                            }
                                                        </datalist>
                                                        <div className="col-12">
                                                            {toRemoveMemberError ?
                                                                <small className="text-danger">{toRemoveMemberError}</small>
                                                                :
                                                                (toRemoveMemberResult ? <small className="text-success">{toRemoveMemberResult}</small> : null)
                                                            }
                                                        </div>
                                                        <button className="btn btn-primary rounded-5 mt-2" onClick={() => {removeMember(); setUserToRemoveMember('');}}>Remove Member</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                        }
                        {!squealerChannel ?
                            (subscribed ? <button className='btn btn-secondary rounded-5 mt-5 mt-md-0 ' onClick={() => {unsubscribe()}}>Unsubscribe</button> : <button className='btn btn-primary rounded-5 mt-5 mt-md-0' onClick={() => {subscribe()}}>Subscribe</button>)
                            :
                            null
                        }
                    </div>

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

async function loadChannelSqueals(name) {
    try {
        const response = await axios.get(`https://${getServerDomain()}/squeals/squeal/channel_squeals?name=${name}`, { withCredentials: true });
        const SquealsComponents = [];

        for (let entry of response.data) {
            const propic = await getUserPropic(entry.sender);
            console.log(entry.id);

            SquealsComponents.push(
                <Squeal
                    key={entry.id} // Consider using the unique entry ID as the key
                    from={entry.from}
                    propic={propic}
                    username={entry.sender}
                    geo={entry.geolocation}
                    img={entry.img}
                    text={entry.text}
                    id={entry.id}
                    date={entry.date}
                    resqueal={entry.resqueal}
                    CM={entry.CM}
                />
            );
        }

        return SquealsComponents;
    } catch (error) {
        console.error(error);
    }
}

function resetNav() {
    let navLinks = document.getElementsByClassName('nav-link');
    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.remove('active');
    }
    if(document.getElementById('nav-description-tab')) {
        document.getElementById('nav-description-tab').classList.add('active');
    }
    let navTabs = document.getElementsByClassName('tab-pane');
    for (let i = 0; i < navTabs.length; i++) {
        navTabs[i].classList.remove('show');
        navTabs[i].classList.remove('active');
    }
    if(document.getElementById('nav-description')) {
        document.getElementById('nav-description').classList.add('show');
        document.getElementById('nav-description').classList.add('active');
    }
}

export default ChannelViewer;
