import { NextFunction, Response } from 'express'
import Stripe from 'stripe'
import createError from '../utils/createError'
import Order from '../models/order.model'
import Gig from '../models/gig.model'
import { IRequest } from '../middleware/jwt'

// export const createOrder =  async (req: IRequest, res: Response): Promise<void> => {
//   const gig = await Gig.findById(req.params.gigId)

//   if (!gig) throw createError(404, 'Gig not found')
  
//   const newOrder = new Order({
//     gigId: gig._id,
//     img: gig.cover,
//     title: gig.title,
//     buyerId: req.userId,
//     sellerId: gig.userId,
//     price: gig.price,
//     payment_intent: 'test'
//   })

//   await newOrder.save()
//   res.status(200).send('successful')
// }

export const intent = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  const stripeKey = process.env.STRIPE_KEY
  if (!stripeKey) {
    return next(createError(500, 'Stripe key not set' )) 
  }
  const stripe = new Stripe(stripeKey, { apiVersion: '2022-11-15'})

  const gig = await Gig.findById(req.params.id)

  if (!gig) throw createError(404, 'Gig not found')

  const paymentIntent = await stripe.paymentIntents.create({
    amount: gig.price * 100,
    currency: 'usd', // todo
    automatic_payment_methods: {
      enabled: true
    }
  })

  const newOrder = new Order({
    gigId: gig._id,
    img: gig.cover,
    title: gig.title,
    buyerId: req.userId,
    sellerId: gig.userId,
    price: gig.price,
    payment_intent: paymentIntent.id
  })

  await newOrder.save()

  res.status(200).send({
    clientSecret: paymentIntent.client_secret
  })
}

export const getOrders = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isPaid: true
    })

    res.status(200).send(orders)
  } catch (err) {
    next(err)
  }
}

export const confirm = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await Order.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent
      },
      {
        $set: {
          isCompleted: true
        }
      }
    )

    res.status(200).send('Order has been confirmed.')
  } catch (err) {
    next(err)
  }
}