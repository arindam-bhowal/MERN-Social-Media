import './rightbar.css'
import Online from '../online/Online'
import { Users } from '../../dummyData'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from "react-router-dom";
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Add, Remove } from '@mui/icons-material'

export default function Rightbar({ user }) {

    const { user: currentUser } = useContext(AuthContext)

    const [friends, setFriends] = useState([])

    const [followed, setFollowed] = useState(false)

    useEffect(() => {
        setFollowed(currentUser.followings.includes(user?.id))
    }, [user, currentUser.followings])

    useEffect(() => {
        const getFriends = async () => {
            try {
                const friendList = await axios.get('http://localhost:5000/api/users/friends/' + user._id)
                setFriends(friendList.data)
            } catch (error) {
                console.log(error)
            }
        }
        getFriends()
    }, [user])

    const handleClick = async () => {
        try {
            if (!followed) {
                await axios.put('http://localhost:5000/api/users/' + user._id + '/unfollow', { userId: currentUser._id })
            } else {
                await axios.put('http://localhost:5000/api/users/' + user._id + '/follow', { userId: currentUser._id })
            }
            setFollowed(!followed)
        } catch (error) {
            console.log(error)
        }
    }

    const HomeRightbar = () => {
        return (
            <>
                <div className="birthdayContainer">
                    <img src="/assets/gift.png" className='birthdayImg' alt="" />
                    <span className="birthdayText">
                        <b>Aditya Bhowal</b> and <b>2 other</b> have their birthday today
                    </span>
                </div>
                <img src="/assets/ad.png" className='rightbarAd' alt="" />
                <h4 className='rightbarTitle'>Online Friends</h4>
                <ul className="rightbarFriendList">
                    {Users.map(user => {
                        return <Online user={user} key={user.id} />
                    })}
                </ul>
            </>)
    }

    const ProfileRightBar = () => {
        return (
            <>
                {user.username !== currentUser.username && (
                    <button className="rightbarFollowButton" onClick={handleClick}>
                        {followed ? 'Unfollow' : 'Follow'}
                        {followed ? <Remove /> : <Add />}
                    </button>
                )}
                <h4 className="rightBarTitle">User Information</h4>
                <div className="rightbarInfoContainer">
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">City: </span>
                        <span className="rightbarInfoValue">{user.city}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">From: </span>
                        <span className="rightbarInfoValue">{user.from}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Relationship: </span>
                        <span className="rightbarInfoValue">{user.relationship === 1 ? 'single' : user.relationship === 2 ? 'Married' : '-'}</span>
                    </div>
                </div>

                <h4 className="rightBarTitle">User Friends</h4>
                <div className="rightbarFollowings">
                    {
                        friends.map(friend => {
                            return (
                                <Link to={`/profile/${friend.username}`} style={{ textDecoration: 'none' }} >
                                    <div className="rightbarFollowing">
                                        <img src={friend.profilePicture || "/assets/profilePicture.png"} alt="" className="rightbarFollowingImg" />
                                        <span className="rightbarFollowingName">{friend.username}</span>
                                    </div>
                                </Link>
                            )
                        })
                    }

                </div>
            </>
        )
    }

    return (
        <div className='rightbar'>
            <div className="rightbarWrapper">

                {user ? <ProfileRightBar /> : <HomeRightbar />}

            </div>
        </div>
    )
}
