import '../styles/SidePane.css';
import {useEffect, useId, useState} from "react";
import Spinner from "./Spinner";
import axios from "axios";
import {getServerDomain} from "../services/Config";
import Tag from "./Tag";
import {getUserPropic} from "../services/AccountManager";

function SidePane({mobile}) {
    const [results, setResults] = useState();
    const searchBarId = useId();
    useEffect(() => {
        async function retrieveResults() {
            setResults(await search());
        }
        retrieveResults();
        document.getElementById(searchBarId).addEventListener('input', retrieveResults);
    }, []);
    async function search() {
        const response = await axios.get(`https://${getServerDomain()}/search?value=${document.getElementById(searchBarId).value}`, {withCredentials: true});
        let result = [];
        for(let entry of response.data){
            const component = <div className='rounded-5 bg-white px-3 py-2 mb-3'>{entry.charAt(0) === "@" ? <img className='col-2 rounded-circle me-2' src={await getUserPropic(entry.slice(1))}/> : null}<Tag tagText={entry}/></div>
            result.push(component);
        }
        return result;
    }
    return(
        <div className={'container-fluid ' + (mobile ? 'border-0' : 'vh-100 bg-black')} id='sidepane-container'>
            <div className='row'>
                <div className='col-12'>
                    <div className="form-floating mt-3">
                        <input type="text" className="form-control rounded-5" id={searchBarId} placeholder="Search Squeals, channels or users"/>
                        <label className='fs-6' htmlFor={searchBarId}>Search channels or users</label>
                        <div className='col-12 mt-3'>
                            {results ? results : <Spinner />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SidePane;
