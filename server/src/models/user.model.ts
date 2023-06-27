import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  username: string
  email: string
  password: string
  address: string
  phone: string
  isAdmin: boolean
  user_photo?: string
  user_cloudinary_id?: string
}

const userSchema: Schema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  user_photo: {
    type: String,
    required: false
  },
  user_cloudinary_id: {
    type: String,
    required: false
  },
},{
  timestamps: true
})

export default mongoose.model<IUser>('User', userSchema)