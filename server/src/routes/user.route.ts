import express, { Router } from 'express'
import { getUser, deleteUser } from '../controllers/user.controller'
import { verifyToken } from '../middleware/jwt'

const router: Router = express.Router()

router.get('/:id', getUser)
router.delete('/:id', verifyToken, deleteUser)

export default router