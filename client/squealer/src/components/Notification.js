import {checkForTags} from "./Squeal";
import axios from "axios";
import {getServerDomain} from "../services/Config";

function Notification({image, date, text, title, id, deleteNotification}) {
    return(
        <div className='container-fluid bg-white rounded-5 p-3 mt-3 mb-3'>
            <div className='row'>
                <div className='col-12 d-flex justify-content-center align-items-center'>
                    <div className='col-1'><img className='w-75 rounded-circle' src={image}/></div>
                    <strong className="me-auto text-black">{title}</strong>
                    <small>{date}</small>
                    <button className='btn py-0 border-0' onClick={() => {deleteNotification(id)}}>
                        <i className="bi bi-x fs-4"></i>
                    </button>
                </div>
            </div>
            <hr />
            <div className='row'>
                <div className='col-12 mb-2 text-black'>
                    {checkForTags(text)}
                </div>
            </div>
        </div>
    )
}

export default Notification;
