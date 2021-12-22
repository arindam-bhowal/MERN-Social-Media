import { PermMedia, Label, Room, EmojiEmotions, Cancel } from '@mui/icons-material'
import { useContext } from 'react'
import './share.css'
import { AuthContext } from '../../context/AuthContext'
import { useRef, useState } from 'react'
import axios from 'axios'

export default function Share() {

    const { user } = useContext(AuthContext)

    const desc = useRef(null)

    const [file, setFile] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newPost = {
            userId: user._id,
            desc: desc.current.value
        }
        if (file) {
            const data = new FormData()
            const fileName = Date.now() + file.name
            data.append('file', file)
            data.append('name', fileName)
            newPost.img = '/images/' + fileName
            try {
                await axios.post('http://localhost:5000/api/upload', data)
            } catch (error) {
                console.log(error)
            }
        }
        console.log(file)

        try {
            await axios.post('http://localhost:5000/api/posts', newPost)
            window.location.reload()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='share'>
            <div className="shareWrapper">
                <div className="shareTop">
                    <img src={user.profilePicture || '/assets/profilePicture.png'} alt="" className='shareProfileImg' />
                    <input ref={desc} className='shareInput' placeholder={"What's in your mind " + user.username + " ?"} />
                </div>

                <hr className="shareHr" />
                {
                    file && (
                        <div className="shareImgContainer">
                            <img src={URL.createObjectURL(file)} className='shareImg' alt="" />
                            <Cancel className='shareCancel' onClick={()=> {setFile(null)}} />
                        </div>
                    )
                }

                <form className="shareBottom" onSubmit={handleSubmit} >
                    <div className="shareOptions">

                        <label htmlFor='file' className="shareOption">
                            <PermMedia htmlColor='tomato' className='shareIcon' />
                            <span className='shareOptionText'>Photos or Videos</span>
                            <input type="file" id='file' style={{ display: 'none' }} accept='.png, .jpeg, .jpg' onChange={(e) => setFile(e.target.files[0])} />
                        </label>

                        <div className="shareOption">
                            <Label htmlColor='blue' className='shareIcon' />
                            <span className='shareOptionText'>Tag</span>
                        </div>
                        <div className="shareOption">
                            <Room htmlColor='green' className='shareIcon' />
                            <span className='shareOptionText'>Locations</span>
                        </div>
                        <div className="shareOption">
                            <EmojiEmotions htmlColor='gold' className='shareIcon' />
                            <span className='shareOptionText'>Feelings</span>
                        </div>

                    </div>
                    <button className='shareButton' type='submit' >Share</button>
                </form>
            </div>
        </div>
    )
}
