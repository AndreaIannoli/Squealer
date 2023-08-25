import '../styles/ScrollPane.css';
import PostBox from "./PostBox";

function ScrollPane() {
    return(
        <div className='container-fluid' id='scrollpane-container'>
            <div className='row'>
                <div className='col-12 p-0'>
                    <div className='d-none d-md-block fw-bolder fs-6 text-white m-3'>Home</div>
                    <hr className='d-none d-md-block' />
                    <PostBox />
                </div>
            </div>
        </div>
    );
}

export default ScrollPane;