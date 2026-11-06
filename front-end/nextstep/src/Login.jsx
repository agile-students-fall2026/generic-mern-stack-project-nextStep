import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "./assets/AuthProvider";
import { Link } from 'react-router-dom';
import './css/pages.css'
import axios from 'axios';
const LOGIN_URL = '/auth';

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ user, roles, accessToken });
            setUser('');
            setPwd('');
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
                // <Link to="/home">Go to Home</Link>
            }
            errRef.current.focus();
        }
    }

    return (
        <div className="screen auth-screen">
            <main className='content auth-content'>
                <header className='auth-header'>
                    <h1 className='auth-logo'>NextStep</h1>
                    <p className='auth-tagline'>Keeping you in the loop</p>
                </header>

                {
                    success ? (
                        <section className="auth-success">
                            <h1 className="auth-title">You are logged in!</h1>
                            <br />
                            <p>
                                <Link className="btn btn-primary" to="/home">
                                    Go to Home</Link>
                            </p>
                        </section>
                    ) : (
                        <section className="auth-section">
                            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                            <h1>Sign In</h1>
                            <form className="auth-form" onSubmit={handleSubmit}>
                                <label className='field' htmlFor="username">Username:</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    id="username"
                                    ref={userRef}
                                    autoComplete="off"
                                    onChange={(e) => {
                                        setUser(e.target.value);
                                        setErrMsg('');
                                    }}
                                    value={user}
                                    required
                                />

                                <label className="field" htmlFor="password">Password:</label>
                                <input
                                    className="form-input"
                                    type="password"
                                    id="password"
                                    onChange={(e) => {
                                        setPwd(e.target.value);
                                        setErrMsg('');
                                    }}
                                    value={pwd}
                                    required
                                />
                                {/* <button>Sign In</button> */}
                                <Link className="btn btn-primary" to="/home"> Sign In </Link>
                            </form>
                            <p>
                                Need an Account?<br />
                                <span className="line">
                                    <Link className="auth-link" to="/signup">Sign Up</Link>
                                </span>
                            </p>
                        </section>
                    )
                }
            </main>
        </div>
    )
}

export default Login
