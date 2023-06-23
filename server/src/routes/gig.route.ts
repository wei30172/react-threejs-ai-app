import express, { Router } from 'express'
import { verifyToken } from '../middleware/authMiddleware'
import {
  createGig,
  getGigs,
  getSingleGig,
  deleteGig,
  updateGig
} from '../controllers/gig.controller'

const router: Router = express.Router()

router.post('/', verifyToken, createGig)
router.get('/', getGigs)
router.get('/single/:id', getSingleGig)
router.delete('/:id', verifyToken, deleteGig)
router.put('/:id', verifyToken, updateGig)

export default router