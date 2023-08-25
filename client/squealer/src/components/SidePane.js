import '../styles/SidePane.css';

function SidePane() {
    return(
        <div className='container-fluid' id='sidepane-container'>
            <div className='row'>
                <div className='col-12'>
                    <div className="form-floating mt-3">
                        <input type="text" className="form-control rounded-5" id="floatingSearch" placeholder="Search Squeals, channels or users"/>
                        <label className='fs-6' htmlFor="floatingSearch">Search Squeals, channels or users</label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SidePane;