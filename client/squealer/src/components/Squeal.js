import '../styles/Squeal.css';

function Squeal(propic, username, from, text){
    return(
        <div className='container-fluid'>
            <div className='row rounded-4 bg-white p-0 ms-3 me-3'>
                <div className='col-12'>
                    <div className='fs-6'>{ "from: " + from }</div>
                </div>
                <div className='col-12'>
                    <div className='col-2'><img src={ propic } className='w-100' id='propic'/></div>
                    <div className='col-10'>
                        <div className='fs-6 fw-semibold '>{ username }</div>
                    </div>
                </div>
                <div className='col-12'>
                    <div className='fs-6'>{text}</div>
                </div>
            </div>
        </div>
    );
}

export default Squeal;