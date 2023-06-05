import { NextFunction, Request, Response } from 'express'
import createError from '../utils/createError'
import Gig from '../models/gig.model'
import { IRequest } from '../middleware/jwt'

export const createGig = async (req: IRequest, res: Response, next: NextFunction) => {
  if (!req.isSeller)
    return next(createError(403, 'Only sellers can create a gig!'))

  const newGig = new Gig({
    userId: req.userId,
    ...req.body
  })

  try {
    const savedGig = await newGig.save()
    res.status(201).json(savedGig)
  } catch (err) {
    next(err)
  }
}

export const getGig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gig = await Gig.findById(req.params.id)
    if (!gig) next(createError(404, 'Gig not found!'))
    res.status(200).send(gig)
  } catch (err) {
    next(err)
  }
}

export const getGigs = async (req: Request, res: Response, next: NextFunction) => {
  const q = req.query
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gt: q.min }),
        ...(q.max && { $lt: q.max })
      }
    }),
    ...(q.search && { title: { $regex: q.search, $options: 'i' } })
  }
  
  try {
    const gigs = await Gig.find(filters).sort({ [q.sort as string]: -1 })
    res.status(200).send(gigs)
  } catch (err) {
    next(err)
  }
}

export const deleteGig = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const gig = await Gig.findById(req.params.id)

    if (!gig) {
      return next(createError(404, 'Gig not found'))
    }

    if (gig.userId !== req.userId) {
      return next(createError(403, 'You can delete only your gig!'))
    }

    await Gig.findByIdAndDelete(req.params.id)
    res.status(200).send('Gig has been deleted!')
  } catch (err) {
    next(err)
  }
}