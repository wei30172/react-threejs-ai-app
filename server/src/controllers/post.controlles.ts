import { NextFunction, Request, Response } from 'express'
import createError from '../utils/createError'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import Post from '../models/post.model'

// @desc    Get AI Images
// @route   GET /api/imageposts
// @access  Public
export const getImagePost = async (_req: Request, res: Response) => {
  try {
    const images = await Post.find({})
    
    res.status(200).json(images)
  } catch (err) {
    res.status(500).json({ message: 'Fetching images failed, please try again' })
  }
}

// @desc    Save Single AI Image
// @route   POST /api/imageposts
// @access  Public
export const saveImagePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, prompt, photo } = req.body

    if (!name || !prompt || !photo) {
      return next(createError(400, 'Name, prompt, and photo are required' ))
    }

    const photoUrl: UploadApiResponse = await cloudinary.uploader.upload(photo)

    const newImage = await Post.create({
      name,
      prompt,
      photo: photoUrl.url,
      cloudinary_id: photoUrl.public_id
    })

    res.status(200).json(newImage)
  } catch (err) {
    res.status(500).json({ message: 'Unable to save the image, please try again' })
  }
}

// @desc    Delete Single AI Image
// @route   DELETE /api/imageposts/:id
// @access  Public
export const deleteImagePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const image = await Post.findById(req.params.id)

    if (!image) {
      return next(createError(404, 'Image not found' ))
    }

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(image.cloudinary_id)

    // Delete the image from the database
    await Post.findByIdAndRemove(req.params.id)

    res.status(200).json({ message: 'Image deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Deleting image failed, please try again' })
  }
}