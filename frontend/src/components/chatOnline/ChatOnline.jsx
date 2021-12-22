import './chatOnline.css'

export default function ChatOnline() {
    return (
        <div className='chatOnline'>

            <div className="chatOnlineImgContainer">
                <img className='chatOnlineImg' src="/assets/profilePicture.png" alt="" />
                <div className="chatOnlineBadge"></div>
            </div>

            <span className="chatOnlineName">Arindam Bhowal</span>
        </div>
    )
}
