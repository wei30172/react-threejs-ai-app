import express, { Request, Response } from 'express'
import * as dotenv from 'dotenv'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'

import Post from '../mongodb/models/post'

dotenv.config()

const router = express.Router()

// Create a new instance of Cloudinary API
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Get all images
router.get('/', async (_req: Request, res: Response) => {
  try {
    const posts = await Post.find({})
    res.status(200).json({ success: true, data: posts })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Fetching images failed, please try again' })
  }
})

// Save the image
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, prompt, photo } = req.body

    if (!name || !prompt || !photo) {
      return res.status(400).json({ message: 'Name, prompt, and photo are required.' })
    }

    const photoUrl: UploadApiResponse = await cloudinary.uploader.upload(photo)

    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.url,
      cloudinary_id: photoUrl.public_id
    })

    res.status(200).json({ success: true, data: newPost })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to save the image, please try again' })
  }
})

// Delete the post
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' })
    }

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(post.cloudinary_id)

    // Delete the post from the database
    await Post.findByIdAndRemove(req.params.id)

    res.status(200).json({ success: true, message: 'Post deleted successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Deleting post failed, please try again' })
  }
})
export default router