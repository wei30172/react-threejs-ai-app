import express, { Router } from 'express'
import { verifyToken } from '../middleware/jwt'
import { getOrders, confirm, createOrder } from '../controllers/order.controller'

const router: Router = express.Router()

router.post('/:gigId', verifyToken, createOrder)
router.get('/', verifyToken, getOrders)
router.put('/', verifyToken, confirm)

export default router