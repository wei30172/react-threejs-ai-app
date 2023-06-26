import { Request, Response, NextFunction } from 'express'

import createError from '../utils/createError'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import User from '../models/user.model'

export interface IRequest extends Request {
  userId?: string
  isSeller?: boolean
}

interface IPayload {
  id: string
  isSeller: boolean
}

export const verifyToken = (req: IRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies['accessToken']

  if (!token) return next(createError(401, 'You are not authenticated!' ))
  
  const jwtKey = process.env.JWT_KEY

  if (!jwtKey) {
    return next(createError(500, 'jwt key not set' )) 
  }

  jwt.verify(token, jwtKey, (err: JsonWebTokenError | null, payload: unknown) => {
    if (err) return next(createError(403, 'Token is not valid!' ))
    
    const typedPayload = payload as IPayload

    req.userId = typedPayload.id
    req.isSeller = typedPayload.isSeller
    next()
  })
}

export const verifyAdmin = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId)

    if (!user) {
      return next(createError(404, 'User not found'))
    }

    if (!user.isSeller) {
      return next(createError(403, 'You are not authenticated!'))
    }

    next()
  } catch (err) {
    return next(err)
  }
}