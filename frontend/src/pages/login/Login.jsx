import './login.css'
import { useRef } from 'react'
import { loginCalls } from '../../apiCalls'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { CircularProgress } from '@mui/material';


export default function Login() {

    const email = useRef(null)
    const password = useRef(null)
    const { user, isFetching, dispatch } = useContext(AuthContext)

    const handleClick = (e) => {
        e.preventDefault()
        loginCalls({ email: email.current.value, password: password.current.value }, dispatch)
    }

    console.log(user, isFetching)

    return (
        <div className='login'>
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className='loginLogo'> AEC - Connect</h3>
                    <span className="loginDescription">Connect with friends and join the world!!</span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input ref={email} placeholder='email' type='email' className="loginInput" required />
                        <input ref={password} placeholder='password' type='password' className="loginInput" required minLength={6} />
                        <button className="loginButton" type='submit'>{isFetching ? <CircularProgress size="20px" /> : "Log in"}</button>
                        <span className="loginForgot">Forgot password</span>
                        <button className="loginRegisterButton">Create a new account</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
