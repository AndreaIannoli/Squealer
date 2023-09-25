import React from "react";

function BackToTop({anchorId}) {
    return(
        <div className='col-12 mt-5 pb-5 mb-5'>
            <div className='row'>
                <div className='col-12 d-flex justify-content-center'>There's nothing left :(</div>
            </div>
            <div className='row'>
                <div className='col-12  d-flex justify-content-center'><a href={'#' + anchorId} className='btn btn-outline-secondary rounded-5'>Go back up!</a></div>
            </div>
        </div>
    );
}

export default BackToTop