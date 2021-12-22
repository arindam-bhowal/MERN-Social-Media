const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()
connectToMongo().catch(err => console.log(err))

async function connectToMongo() {
  await mongoose.connect('mongodb://localhost:27017/aecConnect')
  // await mongoose.connect(process.env.MONGO_URL)
  console.log('Connected to Mongo')
}


module.exports = connectToMongo;