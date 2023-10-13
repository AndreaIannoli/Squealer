import '../styles/ScrollPane.css';
import axios from "axios";
import {getServerDomain} from "../services/Config";
import Squeal from "./Squeal";
import {getUserPropic} from "../services/AccountManager";
import React, {useEffect, useState} from "react";
import Spinner from "./Spinner";
import {useNavigate, useParams} from "react-router-dom";

function AdminScrollPane() {
    const navigate = useNavigate();
    const [squeals, setSqueals] = useState(null);
    const [key, forceUpdate] = useState(0);
    const [result,setResults]= useState();
    const [queryFilter, setQueryFilters]= useState("Sender");
    const [calendar, setCalendar]=useState();
    const logged = document.cookie.includes('loggedStatus');
    const page = window.location.pathname;
    let { name } = useParams();
    async function retriveResults() {
        setResults(await loadFilteredSqueals());

    }
    useEffect(() => {

        retrieveSqueals();
        setTimeout(function() {
            if(document.getElementById('refresh') !== null) {
                document.getElementById('refresh').classList.remove('d-md-none');
                document.getElementById('refresh').classList.add('d-md-flex');
            }
        }, 10000);// Delay for 30000 milliseconds (adjust as needed)
        async  function retriveFilters(){
            setQueryFilters(await filtringSelectedBar());
        }
        retriveFilters();
        document.getElementById("filter").addEventListener('input', retriveFilters);

        async function retrieveSqueals() {
            setSqueals(await loadSqueals());

        }
        retriveResults();


    }, [key]);

    async function getAdmin() {
        try {
            return await axios.get(`https://${getServerDomain()}/admin`, {withCredentials: true}).catch((e) => {
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
    getAdmin()
    async function callLoadDateSqueals(value){
        setResults( await loadDateSqueals(value));
    }
    async function loadDateSqueals(value ) {
        try{

            const response = await axios.get(`https://${getServerDomain()}/search_date?value=${value}`, {withCredentials: true});
            const SquealsReceiver = [];

            for (let entry of response.data) {
                const propic = await getUserPropic(entry.sender);

                SquealsReceiver.push(
                    <Squeal
                        key={entry.id}
                        from={entry.from}
                        propic={propic}
                        username={entry.sender}
                        geo={entry.geolocation}
                        img={entry.img}
                        text={entry.text}
                        id={entry.id}
                        date={entry.date}
                        resqueal={entry.resqueal}
                    />
                );
            }

            return SquealsReceiver;
        }catch (error) {
            console.error(error);
        }
    }

    return(
        <div className='container-fluid overflow-x-hidden bg-dark' id='scrollpane-container'>
            <div className='row'>
                <div className='col-12 p-0'>
                    <div className='row pt-3 pb-0 px-4 mt-0 d-none d-md-flex sticky-top bg-dark'>
                        <div className='col-10 d-none d-md-flex align-items-center'>
                            <div className='fw-bolder fs-6 text-white py-2'>{page === '/' ? 'Home' : page.charAt(1).toUpperCase() + page.slice(2)}</div>
                        </div>
                        <div className='col-2 d-none d-md-none justify-content-end align-items-center' id='refresh'>
                            <button className='btn p-0' onClick={ () => forceUpdate(currentKey => currentKey+1) }><i className="bi bi-arrow-clockwise fs-4"></i></button>
                        </div>
                        <div className='col-12 p-0 d-none d-md-block'>
                            <hr className='d-none d-md-block' />
                        </div>

                        <div className='row'>
                            <div className='col-12'>
                                <select id="filter"  >Filtra per
                                    <option defaultChecked={true} value="Sender">Sender</option>
                                    <option value="Receiver">Receiver</option>
                                    <option value="Date">Date</option>
                                </select>
                            </div>
                            <div>
                                {
                                    queryFilter === "Sender" ? <div className="form-floating mt-3">
                                        <input type="text" className="form-control rounded-5" id="filterSearch" placeholder="Search Sender" onChange={async () => setResults(await loadFilteredSqueals())} />
                                        <label className='fs-6' htmlFor="floatingSearch">Search Sender</label>
                                    </div> : queryFilter === "Receiver" ? <div className="form-floating mt-3">
                                        <input type="text" className="form-control rounded-5" id="filterReceiverSearch" placeholder="Search Receiver" onChange={async () => setResults(await loadReceiverSqueals())}/>
                                        <label className='fs-6' htmlFor="floatingSearch">Search Receiver</label>
                                    </div> : <div className="form-floating mt-3">
                                        <input type="date" className="form-control rounded-5" id="filterData>" placeholder="Search Date" onChange={event => { callLoadDateSqueals(event.target.value) } }/>
                                        <label className='fs-6' htmlFor="floatingSearch">Search Date</label>
                                    </div>

                                }
                            </div>
                        </div>
                        <div className='col-12 p-0 d-none d-md-block'>
                            <hr className='d-none d-md-block' />
                        </div>
                    </div>
                    <div className='col-12 p-0'>
                        <div className='container-fluid mt-3' >
                            <div className='row gap-3' id='squealsContainer' key={key}>
                                {result ? result
                                    :
                                    <Spinner/>
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function loadSqueals() {
    const page = window.location.pathname;
    const logged = document.cookie.includes('loggedStatus');
    return await loadAllSqueals()
}

async function loadAllSqueals() {
    try {
        const response = await axios.get(`https://${getServerDomain()}/merged_squeals`, { withCredentials: true });
        const SquealsComponents = [];

        for (let entry of response.data) {
            const propic = await getUserPropic(entry.sender);

            SquealsComponents.push(
                <Squeal
                    key={entry.id}
                    from={entry.from}
                    propic={propic}
                    username={entry.sender}
                    geo={entry.geolocation}
                    img={entry.img}
                    text={entry.text}
                    id={entry.id}
                    date={entry.date}
                    resqueal={entry.resqueal}
                />
            );
        }

        return SquealsComponents;
    } catch (error) {
        console.error(error);
    }
}

async function filtringSelectedBar(){
    return document.getElementById("filter").value;

}

async function loadFilteredSqueals() {
    try{
        const response = await axios.get(`https://${getServerDomain()}/search_sender?value=${document.getElementById("filterSearch").value}`, {withCredentials: true});
        const SquealsSenders = [];

        for (let entry of response.data) {
            const propic = await getUserPropic(entry.sender);

            SquealsSenders.push(
                <Squeal
                    key={entry.id}
                    from={entry.from}
                    propic={propic}
                    username={entry.sender}
                    geo={entry.geolocation}
                    img={entry.img}
                    text={entry.text}
                    id={entry.id}
                    date={entry.date}
                    resqueal={entry.resqueal}
                />
            );
        }

        return SquealsSenders;
    }catch (error) {
        console.error(error);
    }
}
async function loadReceiverSqueals() {
    try{
        const response = await axios.get(`https://${getServerDomain()}/search_receiver?value=${document.getElementById("filterReceiverSearch").value}`, {withCredentials: true});
        const SquealsReceiver = [];

        for (let entry of response.data) {
            const propic = await getUserPropic(entry.sender);

            SquealsReceiver.push(
                <Squeal
                    key={entry.id}
                    from={entry.from}
                    propic={propic}
                    username={entry.sender}
                    geo={entry.geolocation}
                    img={entry.img}
                    text={entry.text}
                    id={entry.id}
                    date={entry.date}
                    resqueal={entry.resqueal}
                />
            );
        }

        return SquealsReceiver;
    }catch (error) {
        console.error(error);
    }
}




export default AdminScrollPane;