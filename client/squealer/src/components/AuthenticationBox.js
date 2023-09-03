import '../styles/AuthenticationBox.css';
import {Link} from "react-router-dom";

function AuthenticationBox() {
    return(
        <div className='container-fluid'>
            <div className='row gap-1 d-flex justify-content-center'>
                <div className='col-5 p-0'><Link to='/login' className="w-100"><button className='btn btn-primary rounded-5 pe-auto w-100 p-0 py-md-1 px-md-2'>Login</button></Link></div>
                <div className='col-6 p-0'><Link to='/register' className="w-100"><button className='btn btn-secondary rounded-5 pe-auto w-100 p-0 py-md-1 px-md-2'>Register</button></Link></div>
            </div>
        </div>
    );
}

export default AuthenticationBox;