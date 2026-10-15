require('dotenv').config()

const PORT = process.env.PORT

// Si NODE_ENV es 'test', usamos una base de datos diferente (ej. bloglist_test)
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI || 'mongodb+srv://joaogiraldodavila_db_user:Rsji6PiHus1meovN@cluster0.upsbtnh.mongodb.net/bloglist-development?retryWrites=true&w=majority'
  : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}