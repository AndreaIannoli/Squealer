import React, {useEffect, useId, useRef} from "react";
import axios from "axios";
import {getServerDomain} from "../services/Config";
function ChangePasswordModal({changePassword, username}) {
    return (
        <div>
            <div className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false" id={changePassword}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content shadow">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Password Change</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="col-12">
                                <div className="container-fluid pt-4 pt-md-0 mt-5 mt-md-0">
                                    <div className="row rounded-4 bg-white p-0 ms-3 me-3">
                                        <div className="col-12 mb-3 mb-lg-1">
                                            <div className="container-fluid p-0">
                                                <div className="row rounded-4 bg-secondary bg-opacity-25 p-2">
                                                    <hr className="mt-0 mb-1" />
                                                    <div className="col-12">
                                                        <div className="row">
                                                            <div className="col-10 col-md-10 d-flex align-items-center">
                                                                <div className="fs-6 fw-semibold">{username}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <input
                                                    className="col-10 col-md-10 d-flex align-items-center"
                                                    type="password"
                                                    id="oldPass"
                                                    minLength="8"
                                                    placeholder="Insert old password"
                                                    style={{ backgroundColor: "#f0f0f0", padding: "10px", margin: "10px", color: "black", border: "none", borderRadius: "10px" }}
                                                ></input>
                                                <label className="fs-6" htmlFor="oldPass"></label>
                                            </div>
                                            <div>
                                                <input
                                                    className="col-10 col-md-10 d-flex align-items-center"
                                                    type="password"
                                                    id="newPass"
                                                    minLength="8"
                                                    placeholder="Insert new password"
                                                    style={{ backgroundColor: "#f0f0f0", padding: "10px", margin: "10px", color: "black", border: "none", borderRadius: "10px" }}
                                                ></input>
                                                <label className="fs-6" htmlFor="newPass"></label>
                                            </div>
                                            <div className="d-flex">
                                                <button className="btn btn-primary rounded-5 mx-auto" onClick={() => checksErrors(username, document.getElementById("oldPass").value, document.getElementById("newPass").value)}>Password Change</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Finestra modale per le prime due condizioni */}
            <div className="modal" id="passwordLengthModal" tabIndex="-1" aria-labelledby="passwordLengthLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content shadow">
                        <div className="modal-header">
                            <h5 className="modal-title" id="passwordLengthLabel">Password Length Error</h5>
                            <button type="button" className="btn-close" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Password must be at least 8 characters long.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
async function checksErrors(username, oldPassword, newPassword) {
    if(document.getElementById('oldPass').value.length < 8){
        document.getElementById('oldPass').nextElementSibling.innerHTML = 'Password must be at least 8 character long!';
        document.getElementById('newPass').nextElementSibling.innerHTML = '';
    }else if(document.getElementById('newPass').value.length < 8){
        document.getElementById('newPass').nextElementSibling.innerHTML = 'Password must be at least 8 character long!';
        document.getElementById('oldPass').nextElementSibling.innerHTML = '';
    }
    else if (await cambioPassword(username, oldPassword, newPassword)) {
        return;
    }
}
async function cambioPassword(username, oldPassword, newPassword) {
    return await axios.put(`https://${getServerDomain()}/users/user/change_password`, {
        username: username,
        oldPass: oldPassword,
        newPass: newPassword
    }, {withCredentials: true})
        .then(function (response) {
            if (response.data === true) {
                console.log("è andato?")
                document.getElementById("oldPass").value = "";
                document.getElementById("newPass").value = "";
                document.getElementById('newPass').nextElementSibling.innerHTML = 'Password changed correctly, close the tab';
                document.getElementById('oldPass').nextElementSibling.innerHTML = '';

                return "update Password";
            }   else if(response.data === false){
                document.getElementById("oldPass").value = "";
                document.getElementById("newPass").value = "";
                document.getElementById('newPass').nextElementSibling.innerHTML = 'Error password not changed';
                document.getElementById('oldPass').nextElementSibling.innerHTML = '';
                return "not updated Password"
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}
export default ChangePasswordModal;