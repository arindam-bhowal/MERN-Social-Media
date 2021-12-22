const io = require('socket.io')(8900, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

let users = []

const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) && users.push({ userId, socketId })
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find(user => {user.userId === userId})
}

io.on("connection", (socket) => {
    // ========When Connect ===========
    console.log('A user connected')
    // Take User Id and Socket Id from users
    socket.on('addUser', userId => {
        addUser(userId, socket.id)
        //  Get All online Users
        socket.emit('getUsers', users)
    })


    // ===========Send and recieve message=======

    socket.on('sendMessage', ({senderId, recieverId, text}) => {
        const user = getUser(recieverId)
        io.to(user.socketId).emit('getMessages', {senderId, text})
    })

    // =========When disconnect===========
    //  When a user disconnects
    socket.on('disconnect', () => {
        console.log('A user is disconnected')
        removeUser(socket.id)
        socket.emit('getUsers', users)
    })
})