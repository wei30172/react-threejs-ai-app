import { NextFunction, Request, Response } from 'express'
import createError from '../utils/createError'
import bcrypt from 'bcrypt'
import User, { IUser } from '../models/user.model'

interface IRequest extends Request {
  userId?: string
}

const SALT_ROUNDS = 10

export const getUser = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.id

    if (!userId) {
      return next(createError(400, 'User ID is required'))
    }

    const user = await User.findById(userId)
    
    if (!user) {
      return next(createError(404, 'User not found'))
    }
    
    res.status(200).json({
      img: user.img,
      username: user.username
    })
  } catch (err) {
    next(err)
  }
}

export const deleteUser = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.userId)

    if (user) {
      res.status(200).json({ message: 'User is deleted' })
    } else {
      return next(createError(404, 'User not found'))
    }
    
  } catch (err) {
    next(err)
  }
}

export const getUserProfile = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId) as IUser
  
    if (user) {
      res.status(200).json({
        img: user.img,
        username: user.username
      })
    } else {
      return next(createError(404, 'User not found'))
    }
  } catch (err) {
    next(err)
  }
}

export const updateUserProfile = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId) as IUser

    const { username, password } = req.body

    if (user) {
      user.username = username || user.username
      
      if (password) {
        const salt = await bcrypt.genSalt(SALT_ROUNDS)
        user.password = await bcrypt.hash(password, salt)
      }

      const updatedUser = await user.save()
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.username
      })
    } else {
      return next(createError(404, 'User not found'))
    }
  } catch (err) {
    next(err)
  }
}