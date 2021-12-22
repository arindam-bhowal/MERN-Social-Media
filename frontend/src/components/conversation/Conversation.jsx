import axios from 'axios'
import { useEffect, useState } from 'react'
import './conversation.css'

export default function Conversation({ conversation, currentUser }) {

    const [user, setUser] = useState('')

    useEffect(() => {
        const friendId = conversation.members.find(m => m !== currentUser._id)
        const getUser = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/users?userId=' + friendId)
                setUser(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        getUser()
    }, [currentUser._id, conversation.members])

    return (
        <div className='conversation'>
            <img src="/assets/profilePicture.png" alt="" className="conversationImg" />
            <span className="conversationName">{user.username}</span>
        </div>
    )
}
