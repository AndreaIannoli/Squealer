import Navbar from "../components/Navbar";
import SidePane from "../components/SidePane";
import React from "react";
import AdminScrollPane from "../components/AdminScrollPane";

function Admin() {
    return(
        <div className='container-fluid'>
            <div className='row flex-column flex-md-row'>
                <div className='col-12 col-md-3 col-lg-2 p-0'><Navbar /></div>
                <div className='col-12 col-md-9 col-lg-7 p-0 z-0'>< AdminScrollPane/></div>
                <div className='col-lg-3 d-none d-lg-inline-block p-0 z-0'><SidePane /></div>
            </div>
        </div>
    )
}
export default Admin;