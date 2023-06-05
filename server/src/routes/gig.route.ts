import express, { Router } from 'express'
import { verifyToken } from '../middleware/jwt'
import {
  createGig,
  deleteGig,
  getGig,
  getGigs
} from '../controllers/gig.controller'

const router: Router = express.Router()

router.post('/', verifyToken, createGig)
router.get('/single/:id', getGig)
router.get('/', getGigs)
router.delete('/:id', verifyToken, deleteGig)

export default router