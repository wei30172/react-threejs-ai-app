import { NextFunction, Request, Response } from 'express'
import User, { IUser } from '../models/user.model'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface IUserRegisterRequest extends Request {
  body: IUser
}

export const register = async (req: IUserRegisterRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (user) return next(res.status(404).json({ message: 'The email has been registered.' }))

    const hash = bcrypt.hashSync(req.body.password, 5)
    const newUser = new User({
      ...req.body,
      password: hash
    })

    await newUser.save()
    res.status(201).json({ message: 'User has been created, please login.' })
  } catch (err) {
    next(err)
  }
}

interface IUserLoginRequest extends Request {
  body: {
    email: string
    password: string
  }
}

export const login = async (req: IUserLoginRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return next(res.status(404).json({ message: 'User not found' }))

    const isCorrect = bcrypt.compareSync(req.body.password, user.password)
    if (!isCorrect)
      return next(res.status(400).json({ message: 'Wrong password or username' }))  

    const jwtKey = process.env.JWT_KEY
    if (!jwtKey) {
      return next(res.status(500).json({ message: 'Server error' })) 
    }

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller
      },
      jwtKey
    )

    const userObject = user.toObject()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...info } = userObject
    
    res
      .cookie('accessToken', token, {
        httpOnly: true
      })
      .status(200)
      .json({ data: info })
  } catch (err) {
    next(err)
  }
}

export const logout = async (req: Request, res: Response): Promise<void> => {
  res
    .clearCookie('accessToken', {
      sameSite: 'none',
      secure: true
    })
    .status(200)
    .json({ message: 'User has been logged out'})
}