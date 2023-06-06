import express, { Router } from 'express'
import { verifyToken } from '../middleware/jwt'
import {
  createReview,
  getReviews,
  deleteReview,
} from '../controllers/review.controller'


const router: Router = express.Router()

router.post('/', verifyToken, createReview )
router.get('/:gigId', getReviews )
router.delete('/:id', verifyToken, deleteReview)

export default router