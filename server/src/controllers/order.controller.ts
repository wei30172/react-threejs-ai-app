import { NextFunction, Response } from 'express'
import Stripe from 'stripe'
import createError from '../utils/createError'
import Order from '../models/order.model'
import Gig from '../models/gig.model'
import { IRequest } from '../middleware/jwt'

const requiredParams = ['name', 'email', 'address', 'phone', 'color', 'logoDecal', 'fullDecal', 'url']

export const createOrder =  async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const gig = await Gig.findById(req.body.gigId)

    if (!gig) {
      return next(createError(404, 'Gig not found'))
    }

    for (const param of requiredParams) {
      if (!req.body[param]) {
        return next(createError(400, `Missing parameter: ${param}`))
      }
    }

    const newOrder = new Order({
      img: gig.cover,
      title: gig.title,
      price: gig.price,
      sellerId: gig.userId,
      isPaid: false,
      payment_intent: '',
      ...req.body
    })

    await newOrder.save()

    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { sales: 1 }
    }, { new: true })

    res.status(200).json({ message: 'Order created successfully', orderId: newOrder._id })
  } catch (err) {
    next(err)
  }
}

export const intent = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return next(createError(404, 'Order not found'))
    }

    const stripeKey = process.env.STRIPE_KEY
    if (!stripeKey) {
      return next(createError(500, 'Stripe key not set'))
    }
    const stripe = new Stripe(stripeKey, { apiVersion: '2022-11-15' })

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.price * 100,
      currency: 'twd',
      automatic_payment_methods: {
        enabled: true
      }
    })

    if (paymentIntent) order.payment_intent = paymentIntent.id

    await order.save()

    res.status(200).send({
      clientSecret: paymentIntent.client_secret
    })
  } catch (err) {
    next(err)
  }
}

export const getOrder = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return next(createError(404, 'Order not found!'))
    }
    res.status(200).send(order)
  } catch (err) {
    next(err)
  }
}

export const getOrders = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId })
    })

    res.status(200).send(orders)
  } catch (err) {
    next(err)
  }
}

export const confirm = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await Order.findOneAndUpdate({
      payment_intent: req.body.payment_intent
    },
    {
      $set: {
        isPaid: true
      }
    })

    res.status(200).send('Order has been confirmed.')
  } catch (err) {
    next(err)
  }
}