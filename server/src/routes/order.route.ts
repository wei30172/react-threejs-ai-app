import express, { Router } from 'express'
import { verifyToken } from '../middleware/jwt'
import { getOrders, intent, confirm } from '../controllers/order.controller'
// import { getOrders, confirm, createOrder } from '../controllers/order.controller'

const router: Router = express.Router()

// router.post('/:gigId', verifyToken, createOrder)
router.get('/', verifyToken, getOrders)
router.post('/create-payment-intent/:id', verifyToken, intent)
router.put('/', verifyToken, confirm)

export default router