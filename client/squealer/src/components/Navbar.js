import '../styles/Navbar.css';
import squealerLogo from '../img/squealerLogo.svg'
import AuthenticationBox from "./AuthenticationBox";
import {loadSqueals} from "./ScrollPane";
import {Link, useNavigate} from 'react-router-dom';
import {useEffect, useState} from "react";
import {getUserPropic} from "../services/AccountManager";
import Spinner from "./Spinner";

function Navbar() {
    const logged = document.cookie.includes('loggedStatus');
    const navigate = useNavigate();
    const [propic, setPropic] = useState();

    const goToMyProfile = () => {
        navigate('/profiles/' + sessionStorage.getItem('username'));
    };
    useEffect(() => {
        highlightMenu()
        async function retrievePropic() {
            setPropic(await checkPropic());
        }
        retrievePropic();
    }, []);
    return (
        <div className='container-fluid pe-none' id='navbar-container'>
            <div className='row d-flex flex-column justify-content-between h-100'>
                <div className='col-12 d-flex d-md-block' id='navbar-logo-container'>
                    <img src={squealerLogo} id='navbar-logo' className='mx-auto'></img>
                </div>
                <div className='col-12 d-flex flex-column d-md-block justify-content-center p-0 p-md-2'>
                    <ul className='mt-0 mt-md-4 mb-0 p-0 ps-md-3 py-2 py-md-0 d-flex justify-content-center align-items-center d-md-block w-100 h-100 gap-3 gap-md-0 order-1 order-md-0' id='navbar-menu-container'>
                        <li className='mb-md-4 d-inline-block d-md-block'><Link to='/' className='pe-auto navbar-anchor fs-5 navbar-active' id='homeNavBtn'><i className="bi bi-house-fill me-3"></i><div className='d-none d-md-inline'>Home</div></Link></li>
                        <li className='mb-md-4 d-inline-block d-md-block'><Link to='/explore' className='pe-auto navbar-anchor fs-5' id='exploreNavBtn'><i className="bi bi-hash me-3"></i><div className='d-none d-md-inline'>Explore</div></Link></li>
                        <li className='mb-md-4 d-inline-block d-md-none'><Link to='' className='pe-auto navbar-anchor fs-5'><i className="bi bi-search me-3"></i></Link></li>
                        <li className='mb-md-4 d-inline-block d-md-block'><Link to='/notifications' className='pe-auto navbar-anchor fs-5' id='notificationsNavBtn'><i className="bi bi-bell-fill me-3"></i><div className='d-none d-md-inline'>Notifications</div></Link></li>
                        <li className='mb-md-4 d-inline-block d-md-block'><Link to='/messages' className='pe-auto navbar-anchor fs-5' id='messagesNavBtn'><i className="bi bi-envelope-fill me-3"></i><div className='d-none d-md-inline'>Messages</div></Link></li>
                    </ul>
                    { logged ?
                    <div className='d-flex justify-content-end d-md-block order-0 order-md-1'>
                        <Link className='btn btn-primary btn-circle rounded-5 fs-5 fw-semibold ps-3 pe-3 w-100 mt-0 mt-md-5 mb-3 mb-md-0 me-3 ms-md-0 pe-auto' id='squealButton' to='/#postBox'>Squeal</Link>
                    </div>
                        : null
                    }
                </div>
                {!logged ?
                    <div className='col-12 d-block d-md-block order-md-2 mt-3 px-0 mb-md-3' id='navbar-authentication-container'>
                        <AuthenticationBox/>
                    </div>
                :
                    <div type="button" className='col-12 d-flex align-items-center mt-1 mb-md-3 pe-auto' data-bs-toggle="dropdown" aria-expanded="false" id='navbar-propic-container'>
                        <img src={propic ? propic : <Spinner />} className='w-25' id='navbar-propic'/>
                        <div className='fs-6 fw-semibold d-none d-md-block ms-1'>{ '@' + sessionStorage.getItem('username') }</div>
                        <ul className="dropdown-menu">
                            <li><button className='dropdown-item' onClick={ goToMyProfile }>My profile</button></li>
                            <li><button className='dropdown-item' onClick={ logout }>Logout</button></li>
                        </ul>
                    </div>
                }
            </div>
        </div>
    );
}

function logout() {
    sessionStorage.removeItem('loggedStatus');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userPropic');
    document.cookie = 'loggedStatus=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    loadSqueals();
    window.location.reload();
}

function highlightMenu() {
    const path = window.location.pathname;
    if(document.getElementsByClassName('navbar-active').length > 0) {
        document.getElementsByClassName('navbar-active').item(0).classList.remove('navbar-active');
    }
    if(path === '/'){
        document.getElementById('homeNavBtn').classList.add('navbar-active');
    } else if(path.slice(1, path.length)) {
        const elementId = path.slice(1, path.length) + 'NavBtn';
        if(document.getElementById(elementId) !== null){
            document.getElementById(elementId).classList.add('navbar-active');
        }
    }


}
export async function checkPropic() {
    if(sessionStorage.getItem('userPropic') === undefined || !sessionStorage.getItem('userPropic')) {
        return sessionStorage.getItem('userPropic');
    } else {
        console.log("setted here");
        return await getUserPropic(sessionStorage.getItem("username"));
    }
}

export default Navbar;
