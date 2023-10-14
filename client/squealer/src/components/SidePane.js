import '../styles/SidePane.css';
import {useEffect, useState} from "react";
import Spinner from "./Spinner";
import axios from "axios";
import {getServerDomain} from "../services/Config";
import Tag from "./Tag";
import {getUserPropic} from "../services/AccountManager";

function SidePane({mobile}) {
    const [results, setResults] = useState();
    useEffect(() => {
        async function retrieveResults() {
            setResults(await search());
        }
        retrieveResults();
        document.getElementById("floatingSearch").addEventListener('input', retrieveResults);
    }, []);
    return(
        <div className={'container-fluid ' + (mobile ? 'border-0' : 'vh-100 bg-black')} id='sidepane-container'>
            <div className='row'>
                <div className='col-12'>
                    <div className="form-floating mt-3">
                        <input type="text" className="form-control rounded-5" id="floatingSearch" placeholder="Search Squeals, channels or users"/>
                        <label className='fs-6' htmlFor="floatingSearch">Search channels or users</label>
                        <div className='col-12 mt-3'>
                            {results ? results : <Spinner />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

async function search() {
    const response = await axios.get(`https://${getServerDomain()}/search?value=${document.getElementById("floatingSearch").value}`, {withCredentials: true});
    let result = [];
    for(let entry of response.data){
        const component = <div className='rounded-5 bg-white px-3 py-2 mb-3'>{entry.charAt(0) === "@" ? <img className='col-2 rounded-circle me-2' src={await getUserPropic(entry.slice(1))}/> : null}<Tag tagText={entry}/></div>
        result.push(component);
    }
    return result;
}
export default SidePane;
