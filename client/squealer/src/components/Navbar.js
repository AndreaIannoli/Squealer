import '../styles/Navbar.css';
import squealerLogo from '../img/squealerLogo.svg'
import propic from "../img/propic.jpg";

function Navbar() {
    return (
        <div className='container-fluid pe-none' id='navbar-container'>
            <div className='row d-flex flex-column justify-content-between h-100'>
                <div className='col-12 d-flex d-md-block' id='navbar-logo-container'>
                    <img src={squealerLogo} id='navbar-logo' className='mx-auto'></img>
                </div>
                <div className='col-12 d-flex flex-column d-md-block justify-content-center p-0 p-md-2'>
                    <ul className='mt-0 mt-md-4 mb-0 p-0 ps-md-3 py-2 py-md-0 d-flex justify-content-center align-items-center d-md-block w-100 h-100 gap-3 gap-md-0 order-1 order-md-0' id='navbar-menu-container'>
                        <li className='mb-md-4 d-inline-block d-md-block'><a href='' className='navbar-anchor fs-5 navbar-active'><i className="bi bi-house-fill me-3"></i><div className='d-none d-md-inline'>Home</div></a></li>
                        <li className='mb-md-4 d-inline-block d-md-block'><a href='' className='navbar-anchor fs-5'><i className="bi bi-hash me-3"></i><div className='d-none d-md-inline'>Explore</div></a></li>
                        <li className='mb-md-4 d-inline-block d-md-none'><a href='' className='navbar-anchor fs-5'><i className="bi bi-search me-3"></i></a></li>
                        <li className='mb-md-4 d-inline-block d-md-block'><a href='' className='navbar-anchor fs-5'><i className="bi bi-bell-fill me-3"></i><div className='d-none d-md-inline'>Notifications</div></a></li>
                        <li className='mb-md-4 d-inline-block d-md-block'><a href='' className='navbar-anchor fs-5'><i className="bi bi-envelope-fill me-3"></i><div className='d-none d-md-inline'>Messages</div></a></li>
                    </ul>
                    <div className='d-flex justify-content-end d-md-block order-0 order-md-1'>
                        <div className='btn btn-primary btn-circle rounded-5 fs-5 fw-semibold ps-3 pe-3 w-100 mt-0 mt-md-5 mb-3 mb-md-0 me-3 ms-md-0 pe-auto' id='squealButton'>Squeal</div>
                    </div>
                </div>
                <div className='col-12 d-flex align-items-center mt-1 mt-md-auto mb-md-3' id='navbar-propic-container'>
                    <img src={propic} className='w-25' id='navbar-propic'/>
                    <div className='fs-6 fw-semibold d-none d-md-block'>Name Lastname</div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;