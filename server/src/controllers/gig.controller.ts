import { NextFunction, Request, Response } from 'express'
import { deleteFromFolder } from '../utils/cloudinaryUploader'
import createError from '../utils/createError'
import HttpStatusCode from '../constants/httpStatusCodes'
import Gig from '../models/gig.model'
import { IRequest } from '../middleware/authMiddleware'

// @desc    Create Gig
// @route   POST /api/gigs
// @access  Private
export const createGig = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.isAdmin) {
    return next(createError(HttpStatusCode.FORBIDDEN, 'Only admin can create a gig!'))
  }

  const { gig_cloudinary_id, gig_cloudinary_ids } = req.body

  const newGig = new Gig({
    userId: req.userId,
    ...req.body
  })

  try {
    const savedGig = await newGig.save()
    res.status(HttpStatusCode.CREATED).json(savedGig)
  } catch (err) {
    // Delete the image from Cloudinary
    if (gig_cloudinary_id) {
      await deleteFromFolder(gig_cloudinary_id)
    }
    if (gig_cloudinary_ids) {
      await Promise.all(gig_cloudinary_ids.map(async (id: string) => await deleteFromFolder(id)))
    }
    next(err)
  }
}

// @desc    Get Gigs
// @route   GET /api/gigs
// @access  Public
export const getGigs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId, min, max, search, sort } = req.query
  const filters = {
    ...(userId && { userId }),
    ...((min || max) && {
      price: {
        ...(min && { $gte: min }),
        ...(max && { $lte: max })
      }
    }),
    ...(search && { title: { $regex: search, $options: 'i' } })
  }
  
  try {
    let gigs
    if (sort) {
      gigs = await Gig.find(filters).sort({ [sort as string]: -1 })
    } else {
      gigs = await Gig.find(filters)
    }
    res.status(HttpStatusCode.OK).send(gigs)
  } catch (err) {
    next(err)
  }
}

// @desc    Get Single Gig
// @route   GET /api/gigs/single/:id
// @access  Public
export const getSingleGig = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const gig = await Gig.findById(req.params.id)
    if (!gig) {
      return next(createError(HttpStatusCode.NOT_FOUND, 'Gig not found'))
    }
    res.status(HttpStatusCode.OK).send(gig)
  } catch (err) {
    next(err)
  }
}

// @desc    Delete Single Gig
// @route   DELETE /api/gigs/:id
// @access  Private
export const deleteGig = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const gig = await Gig.findById(req.params.id)

    if (!gig) {
      return next(createError(HttpStatusCode.NOT_FOUND, 'Gig not found'))
    }

    if (gig.userId !== req.userId) {
      return next(createError(HttpStatusCode.FORBIDDEN, 'You can delete only your gig'))
    }

    // Delete the image from Cloudinary
    if (gig.gig_cloudinary_id) {
      await deleteFromFolder(gig.gig_cloudinary_id)
    }
    if (gig.gig_cloudinary_ids) {
      await Promise.all(gig.gig_cloudinary_ids.map(async (id) => await deleteFromFolder(id)))
    }

    await Gig.findByIdAndDelete(req.params.id)
    res.status(HttpStatusCode.OK).send({message: 'Gig deleted successfully'})
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
      return next(createError(HttpStatusCode.NOT_FOUND, 'Gig not found'))
    }

    if (gig.userId !== req.userId) {
      return next(createError(HttpStatusCode.FORBIDDEN, 'You can only update your gig'))
    }

    const { gig_photo, gig_cloudinary_id, gig_photos, gig_cloudinary_ids} = req.body

    if (gig_photo && gig_cloudinary_id) {
      if (gig.gig_cloudinary_id) {
        await deleteFromFolder(gig.gig_cloudinary_id)
      }
    }

    if (gig_photos && gig_cloudinary_ids) {
      if (gig.gig_cloudinary_ids) {
        await Promise.all(gig.gig_cloudinary_ids.map(async (id) => await deleteFromFolder(id)))
      }
    }

    const updates = [
      'title', 'desc', 'price', 'shortDesc', 'deliveryTime', 'features',
      'gig_photo', 'gig_photos', 'gig_cloudinary_id', 'gig_cloudinary_ids'
    ].reduce(
      (acc: Record<string, unknown>, key) => {
        if (req.body[key]) acc[key] = req.body[key]
        return acc
      }, {})

    if (Object.keys(updates).length > 0) {
      await Gig.updateOne({ _id: req.params.id }, { $set: updates })
    }

    const updatedGig = await Gig.findById(req.params.id)
    res.status(HttpStatusCode.OK).json(updatedGig)
  } catch (err) {
    next(err)
  }
}