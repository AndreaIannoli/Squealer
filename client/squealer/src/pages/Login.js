import '../styles/Login.css';
import squealerLogo from "../img/squealerLogo.svg";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {getServerDomain} from "../services/Config";

function Login() {
    const navigate = useNavigate();
    const onLoginSubmit = async (event) => {
        event.preventDefault();
        if(!(await checkExistence())){
            return;
        }
        axios.post(`https://${getServerDomain()}/authenticate_user`, {
            "username": document.getElementById("floatingUsername").value,
            "password": document.getElementById("floatingPassword").value
        }, { withCredentials: true }).then(response => {
            console.log(response.data.result);
            if (response.data.result === "successful") {
                sessionStorage.setItem('username', document.getElementById('floatingUsername').value);
                sessionStorage.setItem('userPropic', response.data['userPropic']);
                navigate("/");
            } else {
                document.getElementById('floatingPassword').classList.remove('is-valid');
                document.getElementById('floatingPassword').classList.add('is-invalid');
                document.getElementById('floatingPassword').nextElementSibling.innerHTML = 'Password is wrong!';
            }
        }).catch(error => {
            console.log(error.message);
        });
    }
    return(
        <div className='container-fluid'>
            <div className='position-fixed'><Link to='/'><button className='btn back-arrow-btn'><i className="bi bi-arrow-left-short back-arrow"></i></button></Link></div>
            <div className='row d-flex justify-content-center align-items-center vh-100'>
                <div className='col-11 col-md-8 col-lg-4 mb-5'>
                    <div className='col-12 d-flex justify-content-center'>
                        <img src={squealerLogo}  className='w-25'/>
                    </div>
                    <div className='container-fluid rounded-5 py-3 px-3 px-md-5 mb-5' id='login-container'>
                        <form className='row gap-2' onSubmit={ onLoginSubmit }>
                            <div className='col-12'>
                                <div className="form-floating mt-3">
                                    <input type="text" className="form-control rounded-5" id="floatingUsername" placeholder="Username" required/>
                                    <label className='fs-6' htmlFor="floatingUsername">Username</label>
                                </div>
                            </div>
                            <div className='col-12'>
                                <div className="form-floating mt-3">
                                    <input type="password" className="form-control rounded-5" id="floatingPassword" placeholder="Password" required/>
                                    <label className='fs-6' htmlFor="floatingPassword">Password</label>
                                </div>
                            </div>
                            <div className='col-12 d-flex justify-content-center mt-3 mb-3'>
                                <button className='btn btn-primary rounded-5 fs-5'>Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

async function checkExistence() {
    const toCheck = document.getElementById("floatingUsername").value;
    return await axios.get(`https://${getServerDomain()}/existence_user?username=${toCheck}`)
        .then(response => {
            console.log(document.getElementById("floatingUsername").value);
            console.log(response.data);
            if (response.data === "exist") {
                document.getElementById('floatingUsername').classList.remove('is-invalid');
                document.getElementById('floatingUsername').classList.add('is-valid');
                document.getElementById('floatingUsername').nextElementSibling.innerHTML = 'Username valid!';
                return true;
            } else {
                document.getElementById('floatingUsername').classList.remove('is-valid');
                document.getElementById('floatingUsername').classList.add('is-invalid');
                document.getElementById('floatingUsername').nextElementSibling.innerHTML = 'Username doesn\'t exist!';
                return false;
            }
        }).catch(error => {
            console.log(error.message);
        });
}

export default Login;