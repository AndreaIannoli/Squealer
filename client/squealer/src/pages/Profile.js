import Navbar from "../components/Navbar";
import ProfileViewer from "../components/ProfileViewer";
import SidePane from "../components/SidePane";
import React from "react";


function Profile() {
    return (
        <div className='container-fluid'>
            <div className='row flex-column flex-md-row'>
                <div className='col-12 col-md-3 col-lg-2 p-0'><Navbar/></div>
                <div className='col-12 col-md-9 col-lg-7 p-0 z-0'><ProfileViewer/></div>
                <div className='col-lg-3 d-none d-lg-inline-block p-0 z-0'><SidePane/></div>
            </div>
        </div>
    )
}

export default Profile;