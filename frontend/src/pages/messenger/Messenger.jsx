import { useContext, useState, useEffect } from 'react'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import Conversation from '../../components/conversation/Conversation'
import Message from '../../components/Message/Message'
import Navbar from '../../components/navbar/Navbar'
import { AuthContext } from '../../context/AuthContext'
import './messenger.css'
import axios from 'axios'
import { useRef } from 'react'

const { io } = require("socket.io-client");



export default function Messenger() {

    // All UseStates 

    const [conversations, setConversations] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [arrivalMessage, setArrivalMessage] = useState(null)

    // const [socket, setSocket] = useState(null)

    // Context Api 
    const { user } = useContext(AuthContext)

    // Refs 
    const scrollRef = useRef(null)


    // All UseEffects 
    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/conversations/' + user._id)
                setConversations(res.data)
                // console.log(res.data)
            } catch (error) {
                console.log(error)
            }

        }
        getConversations()
    }, [user])

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/messages/' + currentChat?._id)
                setMessages(res.data)
                // console.log(res.data)
            }
            catch (error) {
                console.log(error)
            }
        }
        getMessages()
    }, [currentChat])


    // Send Message Button function 

    const handleSubmit = async (e) => {
        e.preventDefault()
        const message = {
            conversationId: currentChat._id,
            sender: user._id,
            text: newMessage
        }

        try {
            const res = await axios.post('http://localhost:5000/api/messages', message)
            setMessages([...messages, res.data])
            setNewMessage('')

        } catch (error) {
            console.log(error)
        }
    }

    // For scrolling to last message in the view pane || Scroll into view
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // ===================================SOCKET IO =====================================




    const socket = useRef()

    useEffect(() => {
        socket.current = io("ws://localhost:8900")
    }, [])



    useEffect(() => {
        socket.current.emit('addUser', user._id)

        socket.current.on('getUsers', users => {
            console.log(users)
        })

        const receverId = currentChat?.members.find(member => member !== user._id)
        socket.current.emit('sendMessage', {
            senderId: user._id,
            receverId,
            text: newMessage
        })

        socket.current.on('getMessage', data => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        })

    }, [user, socket, currentChat])

    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages(prevMessages => [...prevMessages, arrivalMessage])
    }, [arrivalMessage, currentChat])

    return (
        <>
            <Navbar />

            <div className='messenger'>


                {/* Previous Conversations */}

                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input type="text" placeholder='Search for friends' className="chatMenuInput" />
                        {conversations.map(c => {
                            return (
                                <div onClick={() => { setCurrentChat(c) }}>
                                    <Conversation key={c._id} conversation={c} currentUser={user} />
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Chat Area */}

                <div className="chatBox">
                    <div className="chatBoxWrapper">

                        {currentChat ?
                            <>
                                <div className="chatBoxTop">


                                    {messages.map(m => {
                                        return (
                                            <div ref={scrollRef}>
                                                <Message message={m} own={m.senderId === user._d} />
                                            </div>
                                        )
                                    })}

                                    {/* <Message own={true} />
                                    <Message /> */}
                                </div>
                                <div className="chatBoxBottom">
                                    <textarea placeholder='write Something....' className='chatMessageInput' onChange={(e) => { setNewMessage(e.target.value) }} value={newMessage} ></textarea>
                                    <button className='chatSubmitButton' onClick={handleSubmit}>Send</button>
                                </div>
                            </>
                            : <span className='noConversationText'>Open a conversation to start a chat</span>
                        }
                    </div>
                </div>


                {/* Online Friends */}

                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline />
                        <ChatOnline />
                        <ChatOnline />
                        <ChatOnline />
                    </div>
                </div>

            </div>
        </>
    )
}
