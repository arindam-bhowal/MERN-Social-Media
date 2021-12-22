import './profile.css'
import Navbar from '../../components/navbar/Navbar'
import Rightbar from '../../components/rightbar/Rightbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feed from '../../components/feed/Feed'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

export default function Profile() {

    // Params 
    const { username } = useParams()

    // GET USERS 
    const [user, setUser] = useState({})
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await axios.get(`http://localhost:5000/api/users?username=${username}`)
            setUser(res.data)
        }
        fetchUsers()
    }, [username])

    return (
        <>
            <Navbar />
            <div className="profile">
                <Sidebar />
                <div className="profileRight">

                    <div className="profileRightTop">

                        <div className="profileCover">
                            <img className='profileCoverImg' src={user.coverPicture || '/assets/post.png'} alt="" />
                            <img className='profileUserImg' src={user.profilePicture || "/assets/profilePicture.png"} alt="" />
                        </div>
                        <div className="profileInfo">
                            <h4 className='profileInfoName' >{user.username}</h4>
                            <span className="profileInfoDesc">{user.desc}</span>
                        </div>

                    </div>
                    <div className="profileRightBottom">
                        <Feed username={username} />
                        <Rightbar user={user} />
                    </div>
                </div>
            </div>
        </>
    )
}
