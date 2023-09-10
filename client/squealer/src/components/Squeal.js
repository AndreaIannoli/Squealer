import '../styles/Squeal.css';
import React from 'react';
import {Link} from 'react-router-dom';

class Squeal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
        <div className='container-fluid'>
            <div className='row rounded-4 bg-white p-2 ms-3 me-3'>
                <div className='col-12 d-flex'>
                    <div className='fs-6'>{"from: " + this.props.from}</div>
                    <div className='fs-6 ms-auto'>{this.formatDate()}</div>
                </div>
                <hr className='mt-0 mb-1'/>
                <div className='col-12'>
                    <div className='row'>
                        <div className='col-1 pe-0'><img src={this.props.propic} className='w-100' id='propic'/></div>
                        <div className='col-10 d-flex align-items-center'>
                            <div className='fs-6 fw-semibold '>{this.props.username}</div>
                        </div>
                    </div>
                </div>
                <div className='col-12'>
                    <div className='fs-6' id='textContainer'>{this.checkForTags(this.props.text)}</div>
                </div>
            </div>
        </div>
        );
    };

    formatDate() {
        const squealDate = new Date(this.props.date);
        const now = new Date();
        const millisecondsDiff = now - squealDate;
        const secondsDiff = Math.floor(millisecondsDiff / 1000);
        const minutesDiff = Math.floor(secondsDiff / 60);
        const hoursDiff = Math.floor(minutesDiff / 60);

        if (hoursDiff >= 24) {
            // If the time difference is at least 24 hours, return just the date
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return squealDate.toLocaleDateString(undefined, options);
        } else if (hoursDiff >= 1) {
            // If the time difference is at least 1 hour, return hours and minutes
            const remainingMinutes = minutesDiff % 60;
            return `${hoursDiff}h ${remainingMinutes}m`;
        } else {
            // If the time difference is less than 1 hour, return just the minutes
            return `${minutesDiff}m`;
        }
    }

    printHi(){
        console.log('ciao');
    }

    checkForTags(text) {
        const regex = /\{\*tag\*\{([^}]+)\}\*tag\*\}/g;
        let lastIndex = 0;
        const components = [];

        text.replace(regex, (match, content, index) => {
            // Add the text between the previous match and the current match as a plain text component
            components.push(text.substring(lastIndex, index));

            // Create a Link component for the current match
            console.log(content);
            const linkText = content;
            //const linkUrl = `/some-url/${linkText}`; // You can customize the URL as needed

            components.push(
                <a className='text-decoration-none' href="#" onClick={this.printHi} key={index}>
                    {linkText}
                </a>
            );

            lastIndex = index + match.length;
        });

        // Add any remaining text after the last match
        components.push(text.substring(lastIndex));
        console.log(components);
        return components;
    }
}
export default Squeal;