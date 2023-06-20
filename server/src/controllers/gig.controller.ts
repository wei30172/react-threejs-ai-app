import { NextFunction, Request, Response } from 'express'
import createError from '../utils/createError'
import Gig from '../models/gig.model'
import { IRequest } from '../middleware/authMiddleware'

// @desc    Create Gig
// @route   POST /api/gigs
// @access  Private
export const createGig = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.isSeller) {
    return next(createError(403, 'Only sellers can create a gig!'))
  }

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

// @desc    Get Single Gig
// @route   GET /api/gigs/single/:id
// @access  Public
export const getGig = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const gig = await Gig.findById(req.params.id)
    if (!gig) {
      return next(createError(404, 'Gig not found'))
    }
    res.status(200).send(gig)
  } catch (err) {
    next(err)
  }
}

// @desc    Get Gigs
// @route   GET /api/gigs
// @access  Public
export const getGigs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
// @desc    Delete Gig
// @route   DELETE /api/gigs/:id
// @access  Private
export const deleteGig = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
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

// @desc    Update Gig
// @route   PUT /api/gigs/:id
// @access  Private
export const updateGig = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const gig = await Gig.findById(req.params.id)

    if (!gig) {
      return next(createError(404, 'Gig not found'))
    }

    if (gig.userId !== req.userId) {
      return next(createError(403, 'You can only update your gig!'))
    }

    const updates = ['title', 'desc', 'shortDesc', 'deliveryTime', 'features', 'images', 'cover', 'price'].reduce(
      (acc: Record<string, unknown>, key) => {
        if (req.body[key]) acc[key] = req.body[key]
        return acc
      }, {})

    if (Object.keys(updates).length > 0) {
      await Gig.updateOne({ _id: req.params.id }, { $set: updates })
    }

    const updatedGig = await Gig.findById(req.params.id)
    res.status(200).json(updatedGig)
  } catch (err) {
    next(err)
  }
}