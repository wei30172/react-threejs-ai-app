import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { deleteFromFolder } from '../utils/cloudinaryUploader'
import createError from '../utils/createError'
import HttpStatusCode from '../constants/httpStatusCodes'
import User, { IUser } from '../models/user.model'
import { IRequest } from '../middleware/authMiddleware'

const SALT_ROUNDS = 10

// @desc    Update User Profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  const { username, password, user_photo, user_cloudinary_id } = req.body
  
  try {
    const user = await User.findById(req.userId) as IUser

    if (!user) {
      return next(createError(HttpStatusCode.NOT_FOUND, 'User not found'))
    }

    if (user_photo && user_cloudinary_id) {
      // Delete the image from Cloudinary
      if (user.user_cloudinary_id) {
        await deleteFromFolder(user.user_cloudinary_id)
      }

      user.user_photo = user_photo
      user.user_cloudinary_id = user_cloudinary_id
    }

    if (username) {
      user.username = username
    }
      
    if (password) {
      const salt = await bcrypt.genSalt(SALT_ROUNDS)
      user.password = await bcrypt.hash(password, salt)
    }

    const updatedUser = await user.save()
    res.status(HttpStatusCode.OK).json({
      _id: updatedUser._id,
      name: updatedUser.username
    })
  } catch (err) {
    // Delete the image from Cloudinary
    if (user_cloudinary_id) {
      await deleteFromFolder(user_cloudinary_id)
    }
    next(err)
  }
}

// @desc    Delete Single User
// @route   DELETE /api/users/profile
// @access  Private
export const deleteUser = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId)

    if (!user) {
      return next(createError(HttpStatusCode.NOT_FOUND, 'User not found'))
    }

    // Delete the image from Cloudinary
    if (user.user_cloudinary_id) {
      await deleteFromFolder(user.user_cloudinary_id)
    }

    await User.findByIdAndDelete(req.userId)

    res.status(HttpStatusCode.OK).json({ message: 'User deleted successfully' })
  } catch (err: unknown) {
    next(err as Error)
  }
}

// @desc    Get User Profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId) as IUser
  
    if (!user) {
      return next(createError(HttpStatusCode.NOT_FOUND, 'User not found'))
    }

    res.status(HttpStatusCode.OK).json({
      user_photo: user.user_photo,
      username: user.username
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Check if User is Admin
// @route   GET /api/users/isadmin
// @access  Private
export const isAdminUser = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId) as IUser
  
    if (!user) {
      return next(createError(HttpStatusCode.NOT_FOUND, 'User not found'))
    }

    res.status(HttpStatusCode.OK).json({ isAdmin: user.isAdmin })
  } catch (err) {
    next(err)
  }
}

// @desc    Get Single User
// @route   GET /api/users/:id
// @access  Public
export const getUserInfoById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.id

    if (!userId) {
      return next(createError(HttpStatusCode.BAD_REQUEST, 'User ID is required'))
    }

    const user = await User.findById(userId)
    
    if (!user) {
      return next(createError(HttpStatusCode.NOT_FOUND, 'User not found'))
    }
    
    res.status(HttpStatusCode.OK).json({
      user_photo: user.user_photo,
      username: user.username
    })
  } catch (err) {
    next(err)
  }
}