import squealLogo from "../img/squealerLogo.svg";
import {useParams} from "react-router-dom";

function Error() {
    let {code, text} = useParams();
     return(
        <div className='container-fluid'>
            <div className='row d-flex justify-content-center'>
                <div className='col-11 col-md-8 col-lg-6'>
                    <div className='col-12 d-flex justify-content-center'>
                        <img src={squealLogo} className='w-25'/>
                    </div>
                    <div className='col-12 d-flex justify-content-center'>
                        <div className='display-2'>{code}</div>
                    </div>
                    <div className='col-12 d-flex justify-content-center'>
                        <div className='fs-5'>{text}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Error;