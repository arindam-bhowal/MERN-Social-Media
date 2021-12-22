const express = require('express')
const connectToMongo = require('./db')
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')
const multer = require("multer");
const path = require('path')

// Import routes
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/post')
const conversationRoute = require("./routes/converstions");
const messageRoute = require('./routes/messages')

const app = express();

// MongoDB connection
// connectToMongo();

// app.use('/images', express.static(path.join(__dirname, '/public/images')))

// middleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))
app.use(cors())

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "/public/images");
    },
    filename: (req, file, cb) => {
        cb(null, file.body.name);
    },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("File uploded successfully");
    } catch (error) {
        console.error(error);
    }
});


// Routes Middleware
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)
app.use('/api/conversations', conversationRoute)
app.use('/api/messages', messageRoute)


// Listening to the app 
app.listen(5000, () => {
    console.log(`Back-end Server is running`)
})