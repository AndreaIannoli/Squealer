import Navbar from "../components/Navbar";
import ScrollPane from "../components/ScrollPane";
import SidePane from "../components/SidePane";
import React from "react";

function Home() {
    return(
        <div className='container-fluid'>
            <div className='row flex-column flex-md-row'>
                <div className='col-12 col-md-3 col-lg-2 p-0'><Navbar /></div>
                <div className='col-12 col-md-9 col-lg-7 p-0 z-0'><ScrollPane /></div>
                <div className='col-lg-3 d-none d-lg-inline-block p-0 z-0'><SidePane /></div>
            </div>
        </div>
    )
}

export default Home;