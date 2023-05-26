import mongoose, { Schema, Document } from 'mongoose'

interface IPost extends Document {
  name: string
  prompt: string
  photo: string
  cloudinary_id: string
}

const PostSchema: Schema = new Schema({
  name: { type: String, required: true },
  prompt: { type: String, required: true },
  photo: { type: String, required: true },
  cloudinary_id: { type: String, required: true },
}, { timestamps: true })

export default mongoose.model<IPost>('Post', PostSchema)