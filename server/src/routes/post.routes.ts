import express, { Router } from 'express'
import * as dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'

import { getPosts, savePost, deletePost } from '../controllers/post.controlles'

dotenv.config()

const router: Router = express.Router()

// Create a new instance of Cloudinary API
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

router.get('/', getPosts)
router.post('/', savePost)
router.delete('/:id', deletePost)

export default router