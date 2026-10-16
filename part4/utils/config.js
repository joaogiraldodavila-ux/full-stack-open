require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? 'mongodb+srv://joaogiraldodavila_db_user:Rsji6PiHus1meovN@cluster0.upsbtnh.mongodb.net/bloglist_test?retryWrites=true&w=majority'
  : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}