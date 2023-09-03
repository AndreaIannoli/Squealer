import '../styles/Registration.css';
import squealerLogo from '../img/squealerLogo.svg';
import {Link} from "react-router-dom";
import axios from "axios";
import defaultPropic from "../img/propic.jpg";
import {getServerDomain} from "../services/Config";

function Registration() {
    return(
        <div className='container-fluid'>
            <div className='position-fixed'><Link to='/'><button className='btn back-arrow-btn'><i className="bi bi-arrow-left-short back-arrow"></i></button></Link></div>
            <div className='row d-flex justify-content-center align-items-center vh-100'>
                <div className='col-11 col-md-8 col-lg-4 mb-5'>
                    <div className='col-12 d-flex justify-content-center'>
                        <img src={squealerLogo}  className='w-25'/>
                    </div>
                    <div className='container-fluid rounded-5 py-3 px-3 px-md-5 mb-5' id='registration-container'>
                        <form className='row' onSubmit={ onRegistrationSubmit }>
                            <div className='col-6 pe-1'>
                                <div className="form-floating mt-3">
                                    <input type="text" className="form-control rounded-5" id="floatingName" placeholder="Name" required/>
                                    <label className='fs-6' htmlFor="floatingName">Name</label>
                                </div>
                            </div>
                            <div className='col-6 ps-1'>
                                <div className="form-floating ms-0 mt-3">
                                    <input type="text" className="form-control rounded-5" id="floatingSurname" placeholder="Surname" required/>
                                    <label className='fs-6' htmlFor="floatingSurname">Surname</label>
                                </div>
                            </div>
                            <div className='col-12'>
                                <div className="form-floating mt-3">
                                    <input type="email" className="form-control rounded-5" id="floatingEmail" placeholder="Email" required/>
                                    <label className='fs-6' htmlFor="floatingEmail">Email</label>
                                </div>
                            </div>
                            <div className='col-12'>
                                <div className="form-floating mt-3">
                                    <input type="text" className="form-control rounded-5" id="floatingUsername" placeholder="@yourusername" maxLength="12" required/>
                                    <label className='fs-6' htmlFor="floatingUsername">@yourusername</label>
                                </div>
                            </div>
                            <div className='col-12'>
                                <div className="form-floating mt-3">
                                    <input type="password" className="form-control rounded-5" id="floatingPassword" placeholder="Password" minLength="8" required/>
                                    <label className='fs-6' htmlFor="floatingPassword">Password</label>
                                </div>
                            </div>
                            <div className='col-12'>
                                <div className="form-floating mt-3">
                                    <input type="password" className="form-control rounded-5" id="floatingConfirmPassword" placeholder="Confirm password" required/>
                                    <label className='fs-6' htmlFor="floatingPassword">Confirm password</label>
                                </div>
                            </div>
                            <div className="col-12 mt-3">
                                <label htmlFor="propicUpload" className="form-label ps-3">Profile Image</label>
                                <input className="form-control rounded-5" type="file" id="propicUpload" name="propicUpload"
                                       accept=".jpg,.png" />
                            </div>
                            <div className='col-12 d-flex justify-content-center mt-3 mb-3'>
                                <button className='btn btn-primary rounded-5 fs-5 submit' type='submit'>Register</button>
                            </div>
                        </form>
                    </div>
                    <button className='btn btn-primary rounded-5 fs-5' onClick={ imageCheck }>Check Propic</button>
                    <button className='btn btn-primary rounded-5 fs-5' onClick={ checkUsername }>Check User</button>
                </div>
            </div>
        </div>
    );
}

async function checkUsername() {
    const toCheck = document.getElementById("floatingUsername").value;
    return await axios.get(`https://${getServerDomain()}/existence_user?username=${toCheck}`)
        .then(response => {
            if (response.data === "exist") {
                document.getElementById('floatingUsername').classList.remove('is-valid');
                document.getElementById('floatingUsername').classList.add('is-invalid');
                document.getElementById('floatingUsername').nextElementSibling.innerHTML = 'Username already exist!';
                return true;
            } else {
                document.getElementById('floatingUsername').classList.remove('is-invalid');
                document.getElementById('floatingUsername').classList.add('is-valid');
                document.getElementById('floatingUsername').nextElementSibling.innerHTML = 'Username valid!';
                return false;
            }
        }).catch(error => {
            console.log(error.message);
            return true;
        });
}

const onRegistrationSubmit = async (event) => {
    event.preventDefault();
    if (await checkUsername()) {
        return;
    }
    if (document.getElementById('floatingPassword').value.length < 8) {
        document.getElementById('floatingPassword').classList.remove('is-valid');
        document.getElementById('floatingPassword').classList.add('is-invalid');
        document.getElementById('floatingPassword').nextElementSibling.innerHTML = 'Password must be at least 8 character long!';
        return;
    } else {
        document.getElementById('floatingPassword').classList.remove('is-invalid');
        document.getElementById('floatingPassword').classList.add('is-valid');
        document.getElementById('floatingPassword').nextElementSibling.innerHTML = 'Password is valid!';
    }
    if (document.getElementById('floatingConfirmPassword').value !== document.getElementById('floatingPassword').value) {
        document.getElementById('floatingConfirmPassword').classList.remove('is-valid');
        document.getElementById('floatingConfirmPassword').classList.add('is-invalid');
        document.getElementById('floatingConfirmPassword').nextElementSibling.innerHTML = 'Password does not match!';
        return;
    } else {
        document.getElementById('floatingConfirmPassword').classList.remove('is-invalid');
        document.getElementById('floatingConfirmPassword').classList.add('is-valid');
        document.getElementById('floatingConfirmPassword').nextElementSibling.innerHTML = 'Password does match!';
    }
    const selectedImage = document.getElementById('propicUpload').files[0];
    if (selectedImage) {
        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);
        reader.onload = async function (event) {
            const encode_img = event.target.result;
            axios.post(`https://${getServerDomain()}/register_user`, {
                "name": document.getElementById('floatingName').value,
                "surname": document.getElementById('floatingSurname').value,
                "email": document.getElementById('floatingEmail').value,
                "username": document.getElementById('floatingUsername').value,
                "password": document.getElementById('floatingPassword').value,
                "propic": encode_img,
            }, { withCredentials: true }).catch(error => {
                console.log(error.message);
            });
            sessionStorage.setItem('userPropic', encode_img);
            sessionStorage.setItem('username', document.getElementById('floatingUsername').value);
            window.location.href = "/";
        };
        event.preventDefault();
    } else {
        axios.post(`https://${getServerDomain()}/register_user`, {
            "name": document.getElementById('floatingName').value,
            "surname": document.getElementById('floatingSurname').value,
            "email": document.getElementById('floatingEmail').value,
            "username": document.getElementById('floatingUsername').value,
            "password": document.getElementById('floatingPassword').value,
        }, { withCredentials: true }).catch(error => {
            console.log(error.message);
        });
        sessionStorage.setItem('userPropic', defaultPropic);
        sessionStorage.setItem('username', document.getElementById('floatingUsername').value);
        window.location.href = "/";
    }
}

function imageCheck() {
    const selectedImage = document.getElementById('propicUpload').files[0];
    console.log(selectedImage);
    console.log(defaultPropic);
    if(selectedImage) {
        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);
        reader.onload = function(event) {
            const encode_img = event.target.result.split(',')[1];
            const base64Image = Buffer.from(encode_img,'base64');
            console.log(encode_img);
            console.log(base64Image);
        };
    }
}

export default Registration;