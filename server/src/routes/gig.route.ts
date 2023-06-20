import express, { Router } from 'express'
import { verifyToken } from '../middleware/authMiddleware'
import {
  createGig,
  getGig,
  getGigs,
  deleteGig,
  updateGig
} from '../controllers/gig.controller'

const router: Router = express.Router()

router.post('/', verifyToken, createGig)
router.get('/single/:id', getGig)
router.get('/', getGigs)
router.delete('/:id', verifyToken, deleteGig)
router.put('/:id', verifyToken, updateGig)

export default router