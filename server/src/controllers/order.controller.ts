import { NextFunction, Response } from 'express'
import Stripe from 'stripe'
import createError from '../utils/createError'
import Order from '../models/order.model'
import Gig from '../models/gig.model'
import { IRequest } from '../middleware/authMiddleware'

const requiredParams = ['name', 'email', 'address', 'phone', 'color', 'url']

// @desc    Create Order
// @route   POST /api/orders
// @access  Private
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

const getStripe = () => {
  const stripeKey = process.env.STRIPE_KEY
  if (!stripeKey) {
    throw createError(500, 'Stripe key not set')
  }

  return new Stripe(stripeKey, { apiVersion: '2022-11-15' })
}

export default getStripe

// @desc    Create Payment Intent
// @route   POST /api/orders/create-payment-intent/:id
// @access  Private
export const intent = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return next(createError(404, 'Order not found'))
    }

    const stripe = getStripe()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.price * 100,
      currency: 'twd',
      metadata: { orderId: order._id.toString() }
    })

    if (!paymentIntent) {
      return next(createError(500, 'Failed to create payment intent'))
    }

    order.payment_intent = paymentIntent.id

    await order.save()

    res.status(200).send({
      clientSecret: paymentIntent.client_secret
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get Single Order
// @route   GET /api/orders/single/:id
// @access  Private
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

// @desc    Get Orders
// @route   GET /api/orders
// @access  Private
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

// @desc    Confirm Payment
// @route   PUT /api/orders
// @access  Private
export const confirm = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stripe = getStripe()

    const paymentIntent = await stripe.paymentIntents.retrieve(req.body.payment_intent)
    const orderId = paymentIntent.metadata.orderId // Get the order id from PaymentIntent metadata

    const order = await Order.findById(orderId)

    if (!order) {
      return next(createError(400, 'Order not found.'))
    }

    order.isPaid = true
    await order.save()

    res.status(200).send('Order has been confirmed.')
  } catch (err) {
    next(err)
  }
}