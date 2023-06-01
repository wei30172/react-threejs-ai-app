import { NextFunction, Request, Response } from 'express'
import createError from '../utils/createError'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import Post from '../models/post.model'

export const getPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await Post.find({})
    
    res.status(200).json(posts)
  } catch (err) {
    res.status(500).json({ message: 'Fetching images failed, please try again' })
  }
}

export const savePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, prompt, photo } = req.body

    if (!name || !prompt || !photo) {
      return next(createError(400, 'Name, prompt, and photo are required' ))
    }

    const photoUrl: UploadApiResponse = await cloudinary.uploader.upload(photo)

    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.url,
      cloudinary_id: photoUrl.public_id
    })

    res.status(200).json(newPost)
  } catch (err) {
    res.status(500).json({ message: 'Unable to save the image, please try again' })
  }
}

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return next(createError(404, 'Post not found' ))
    }

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(post.cloudinary_id)

    // Delete the post from the database
    await Post.findByIdAndRemove(req.params.id)

    res.status(200).json({ message: 'Post deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Deleting post failed, please try again' })
  }
}