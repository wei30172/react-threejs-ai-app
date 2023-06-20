import { NextFunction, Request, Response } from 'express'
import createError from '../utils/createError'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/user.model'

interface IUserRegisterRequest extends Request {
  body: IUser
}

const SALT_ROUNDS = 10

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: IUserRegisterRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return next(createError(400, 'Missing email or password'))
    }

    const user = await User.findOne({ email })
    if (user) return next(createError(409, 'The email has been registered'))

    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const hash = await bcrypt.hash(password, salt)

    const newUser = new User({
      ...req.body,
      password: hash
    })

    await newUser.save()
    res.status(201).json({ message: 'User has been created please login.' })
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

// @desc    login & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: IUserLoginRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password: userInputPassword } = req.body
    
    if (!email || !userInputPassword) {
      return next(createError(400, 'Missing email or password'))
    }

    const user = await User.findOne({ email })
    if (!user) return next(createError(404, 'User not found'))

    const isCorrect = await bcrypt.compare(userInputPassword, user.password)
    if (!isCorrect) return next(createError(400, 'Wrong password'))

    const jwtKey = process.env.JWT_KEY
    if (!jwtKey) {
      return next(createError(500, 'JWT key not set'))
    }

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller
      },
      jwtKey,
      {
        expiresIn: '30d'
      }
    )

    const userObject = user.toObject()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...info } = userObject
    
    res
      .cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      })
      .status(200)
      .json(info)
  } catch (err) {
    next(err)
  }
}

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req: Request, res: Response): Promise<void> => {
  res
    .clearCookie('accessToken', {
      sameSite: 'none', // todo
      secure: true
    })
    .status(200)
    .json({ message: 'User has been logged out'})
}