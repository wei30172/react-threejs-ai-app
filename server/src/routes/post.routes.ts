import express, { Router } from 'express'
import * as dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'

import { getImagePosts, saveImagePost, deleteImagePost } from '../controllers/post.controlles'

dotenv.config()

const router: Router = express.Router()

// Create a new instance of Cloudinary API
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

router.get('/', getImagePosts)
router.post('/', saveImagePost)
router.delete('/:id', deleteImagePost)

export default router