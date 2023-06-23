import express, { Router } from 'express'
import { verifyToken } from '../middleware/authMiddleware'
import {
  generateDalleImage
} from '../controllers/dalle.controlles'

const router: Router = express.Router()

router.post('/', verifyToken, generateDalleImage)

export default router