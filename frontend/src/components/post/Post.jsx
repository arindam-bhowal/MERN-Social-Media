import './post.css'
import { MoreVert } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { format } from 'timeago.js'
import { Link } from 'react-router-dom'
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'

export default function Post(props) {
    const { post } = props
    // console.log(post)

    const { user: currentUser } = useContext(AuthContext)

    // GET USERS 
    const [user, setUser] = useState({})
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await axios.get(`http://localhost:5000/api/users?userId=${post.userId}`)
            setUser(res.data)
        }
        fetchUsers()
    }, [post.userId])

    // LIKE COUNTER 
    const [like, setlike] = useState(post.likes.length)
    const [isLiked, setisLiked] = useState(false)

    const handleLikes = async () => {
        try {
            await axios.put('http://localhost:5000/api/posts/' + post._id + '/likes', { userId: currentUser._id })
        } catch (error) {
            console.log(error)
        }
        setlike(!isLiked ? like + 1 : like - 1)
        setisLiked(!isLiked)
    }


    return (
        <div className='post'>
            <div className="postWrapper">

                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`/profile/${user.username}`} >
                            <img src={user.profilePicture || '/assets/profilePicture.png'} className='postProfileImg' alt="" />
                        </Link>
                        <span className="postUsername">{user.username}</span>
                        <span className="postDate">{format(post.updatedAt)}</span>
                    </div>
                    <div className="postTopRight">
                        <MoreVert />
                    </div>
                </div>

                <div className="postCenter">
                    <span className="postText">{post?.desc}</span>
                    {/* LATER  */}
                    {/* <img src={post.picture} className='postImg' alt="" /> */}
                    <img src='/assets/coverPicture.png' className='postImg' alt="" />
                </div>

                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img className='likeIcon' src="/assets/like.png" onClick={handleLikes} alt="" />
                        {/* <img className='likeIcon' src="/assets/heart.png" onClick={handleLikes} alt="" /> */}
                        <div className="postLikeCounter">{like} people liked it</div>
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText">{post.comment} comments</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
