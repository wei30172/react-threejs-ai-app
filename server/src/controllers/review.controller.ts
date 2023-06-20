import { NextFunction, Request, Response } from 'express'
import createError from '../utils/createError'

import Review, { IReview } from '../models/review.model'
import Gig, { IGig } from '../models/gig.model'
import Order from '../models/order.model'
import { IRequest } from '../middleware/authMiddleware'

export const createReview = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  if (req.isSeller) {
    return next(createError(403, 'Sellers can not create a review!'))
  }

  const reviewData: IReview = new Review({
    userId: req.userId,
    gigId: req.body.gigId,
    desc: req.body.desc,
    star: req.body.star
  })

  try {
    // Check if the user purchased the gig
    const purchase = await Order.findOne({
      gigId: req.body.gigId,
      buyerId: req.userId
    })

    if (!purchase) {
      return next(createError(403, 'You can not review a gig that you did not purchase'))
    }

    // Check if the user created the review
    const review = await Review.findOne({
      gigId: req.body.gigId,
      userId: req.userId
    })

    if (review) {
      return next(createError(403, 'You have already created a review for this gig!'))
    }

    const savedReview = await reviewData.save()

    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { totalStars: req.body.star, starNumber: 1 }
    })

    res.status(201).send(savedReview)
  } catch (err) {
    next(err)
  }
}

export const getReviews = async (req: Request<{ gigId: IGig['_id'] }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId })
    res.status(200).send(reviews)
  } catch (err) {
    next(err)
  }
}

export const deleteReview = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return next(createError(404, 'Review not found'))
    }

    if (review.userId !== req.userId) {
      return next(createError(403, 'You can only delete your own reviews'))
    }

    await Review.findByIdAndDelete(req.params.id)

    await Gig.findByIdAndUpdate(review.gigId, {
      $inc: { totalStars: -review.star, starNumber: -1 }
    })

    res.status(200).send('Review has been deleted!')
  } catch (err) {
    next(err)
  }
}