import express, { Router } from 'express'
import {
  createGig,
  deleteGig,
  getGig,
  getGigs
} from '../controllers/gig.controller'
import { verifyToken } from '../middleware/jwt'

const router: Router = express.Router()

router.post('/', verifyToken, createGig)
router.delete('/:id', verifyToken, deleteGig)
router.get('/single/:id', getGig)
router.get('/', getGigs)

export default router