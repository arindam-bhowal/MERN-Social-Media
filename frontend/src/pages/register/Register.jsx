import axios from 'axios'
import { useRef } from 'react'
import './register.css'
import { useNavigate } from 'react-router-dom'

export default function Register() {

    const username = useRef(null)
    const email = useRef(null)
    const password = useRef(null)
    const Cpassword = useRef(null)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(password.current.value !== Cpassword.current.value){
            password.current.setCustomValidity("Passwords don't match!")
        }else{
            const user = {
                username : username.current.value,
                email: email.current.value,
                password: password.current.value
            }
            try {
                await axios.post('http://localhost:5000/api/auth/register', user)
                navigate('/login')
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <div className='register'>
            <div className="registerWrapper">
                <div className="registerLeft">
                    <h3 className='registerLogo'> AEC - Connect</h3>
                    <span className="registerDescription">Connect with friends and join the world!!</span>
                </div>
                <div className="registerRight">
                    <form className="registerBox" onSubmit={handleSubmit}>
                        <input ref={username} placeholder='username' type='text' className="registerInput" required />
                        <input ref={email} placeholder='email' type='email' className="registerInput" required />
                        <input ref={password} placeholder='password' type='password' className="registerInput" minLength={6} required />
                        <input ref={Cpassword} placeholder='confirm password' type='password' className="registerInput" minLength={6} required />
                        <button className="registerButton" type='submit'>Sign Up</button>
                        <button className="registerRegisterButton">Login into Account</button>
                    </form>
                </div>
            </div>
        </div>
    )
}