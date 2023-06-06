import express, { Router } from 'express'
import { verifyToken } from '../middleware/jwt'
import { getUser, deleteUser } from '../controllers/user.controller'

const router: Router = express.Router()

router.get('/:id', getUser)
router.delete('/:id', verifyToken, deleteUser)

export default router