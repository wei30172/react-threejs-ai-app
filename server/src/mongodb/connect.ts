import mongoose from 'mongoose'

const connectDB = async (url: string): Promise<void> => {
  try {
    mongoose.set('strictQuery', true)
    await mongoose.connect(url)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Failed to connect with MongoDB')
    console.error(error)
  }
}

export default connectDB