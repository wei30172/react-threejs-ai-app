import express, { Router } from 'express'
import { verifyToken } from '../middleware/authMiddleware'
import { getOrder, getOrders, createOrder, intent, confirm } from '../controllers/order.controller'

const router: Router = express.Router()

router.post('/', verifyToken, createOrder)
router.post('/create-payment-intent/:id', verifyToken, intent)
router.get('/single/:id', verifyToken, getOrder)
router.get('/', verifyToken, getOrders)
router.put('/', verifyToken, confirm)

export default router