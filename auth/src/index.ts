import mongoose from 'mongoose'
import { app } from './app'
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('no jwt key found')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('no MONGO_URI found')
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    app.listen(3000, () => {
      console.log('Auth server is up and running on port:3000')
    })
  } catch (error) {
    console.log(error)
  }
}
start()
