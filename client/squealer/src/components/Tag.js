import {RouterProvider, useNavigate} from "react-router-dom";
import React from "react";
import {router} from "../index";
import {Link} from 'react-router-dom';

function Tag({tagText}){
    function goToTagPage() {
        console.log(tagText);
        if (tagText.charAt(0) === '@') {
            return '/profiles/' + tagText.slice(1);
        } else {
            return '/channels/' + tagText.slice(1);
        }
    }
    return(<Link to={ goToTagPage(tagText) }>{tagText}</Link>)
}

export default Tag;