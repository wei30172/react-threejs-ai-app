import { NextFunction, Request, Response } from 'express'
import createError from '../utils/createError'
import User, { IUser } from '../models/user.model'

interface IRequest extends Request {
  userId?: string
}

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id) as IUser
    
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ message: 'The user does not exist' })
  }
}

export const deleteUser = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id) as IUser
    
    if (req.userId !== user._id.toString()) {
      return next(createError(403, 'You can delete only your account!' ))
    }

    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'The user is deleted' })
  } catch (err) {
    res.status(500).json({ message: 'The user does not exist' })
  }
}