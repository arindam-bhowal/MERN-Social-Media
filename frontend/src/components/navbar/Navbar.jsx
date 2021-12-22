import './navbar.css'
import { Search, Person, Chat, Notifications } from '@mui/icons-material'
import { Link } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

    const { user } = useContext(AuthContext)
    let navigate = useNavigate();

    return (
        <div className="navbarContainer">
            <div className="navbarLeft">
                <Link to='/' style={{ textDecoration: 'none' }}>
                    <span className="logo" >Aec Connect</span>
                </Link>
            </div>
            <div className="navbarCenter">

                <div className="searchbar">
                    <Search className='searchIcon' />
                    <input className="searchInput" placeholder="Search for friends, post or videos" />
                </div>
            </div>

            <div className="navbarRight">
                <div className="navbarLinks">
                    <span className="topbarLink">Homepage</span>
                    <span className="topbarLink">Timeline</span>
                </div>
                <div className="navbarIcons">
                    <div className="navbarIconItem">
                        <Person />
                        <span className="navbarIconBadge">1</span>
                    </div>
                    <div className="navbarIconItem"> 
                        <Chat onClick={()=>{navigate('/messenger')}} />
                        <span className="navbarIconBadge">1</span>
                    </div>
                    <div className="navbarIconItem">
                        <Notifications />
                        <span className="navbarIconBadge">1</span>
                    </div>
                </div>
                <Link to={`/profile/${user.username}`} >
                    <img src={user.profilePicture || '/assets/profilePicture.png'} alt="" className="navbarImg" />
                </Link>
            </div>
        </div>
    )
}

export default Navbar
