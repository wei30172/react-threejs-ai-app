import { Request, Response, NextFunction } from 'express'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'

interface IRequest extends Request {
  userId?: string
  isSeller?: boolean
}

interface IPayload {
  id: string
  isSeller: boolean
}

export const verifyToken = (req: IRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies['accessToken']
  if (!token) return next(res.status(401).json({ message: 'You are not authenticated!' }))
  
  const jwtKey = process.env.JWT_KEY
  if (!jwtKey) {
    return next(res.status(500).json({ message: 'Server error' })) 
  }

  jwt.verify(token, jwtKey, (err: JsonWebTokenError | null, payload: unknown) => {
    if (err) return next(res.status(403).json({ message: 'Token is not valid!' }))
    
    const typedPayload = payload as IPayload

    req.userId = typedPayload.id
    req.isSeller = typedPayload.isSeller
    next()
  })
}