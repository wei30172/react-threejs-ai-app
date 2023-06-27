import mongoose, { Schema, Document } from 'mongoose'

interface IPost extends Document {
  name: string
  prompt: string
  post_photo: string
  post_cloudinary_id: string
}

const PostSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    prompt: {
      type: String,
      required: true
    },
    post_photo: {
      type: String,
      required: true
    },
    post_cloudinary_id: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model<IPost>('Post', PostSchema)