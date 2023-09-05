import '../styles/Squeal.css';
import React from 'react';

class Squeal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
        <div className='container-fluid'>
            <div className='row rounded-4 bg-white p-0 ms-3 me-3'>
                <div className='col-12'>
                    <div className='fs-6'>{"from: " + this.props.from}</div>
                </div>
                <div className='col-12'>
                    <div className='row'>
                        <div className='col-2'><img src={this.props.propic} className='w-75' id='propic'/></div>
                        <div className='col-10'>
                            <div className='fs-6 fw-semibold '>{this.props.username}</div>
                        </div>
                    </div>
                </div>
                <div className='col-12'>
                    <div className='fs-6'>{this.props.text}</div>
                </div>
            </div>
        </div>
        );
    };
}

export default Squeal;