import '../styles/PostBox.css';
import {useEffect} from "react";
import propic from '../img/propic.jpg';

function PostBox() {
    useEffect(() => {
        const textarea = document.getElementById('floatingTextarea');
        textarea.addEventListener('input', resizeTextarea);
    })
    return(
        <div className='container-fluid'>
            <div className='row rounded-4 bg-white p-0 ms-3 me-3'>
                <div className='col-2 col-md-2 col-lg-2 p-3 d-none d-md-flex'>
                    <img src={propic} className='w-100' id='propic'/>
                </div>
                <div className='col-12 col-md-9 col-lg-10 mb-3 mb-lg-1'>
                    <div className="form-floating">
                        <textarea className="form-control textarea-input no-border" id="floatingTextarea" placeholder="What's you want to squeal?"/>
                        <label htmlFor="floatingTextarea">What's you want to squeal?</label>
                    </div>
                    <div className='d-flex'>
                        <button className='btn postbox-btn'><i className="bi bi-images"></i></button>
                        <button className='btn postbox-btn'><i className="bi bi-geo-alt"></i></button>
                        <button className='btn btn-primary rounded-5 ms-auto'>Squeal<i className="bi bi-send-fill ms-2"></i></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function resizeTextarea() {
    const textarea = document.getElementById('floatingTextarea');
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
}

export default PostBox;