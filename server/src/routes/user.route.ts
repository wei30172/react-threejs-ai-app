import express, { Router } from 'express'
import { deleteUser, getUser } from '../controllers/user.controller'
// import { verifyToken } from '../middleware/jwt'

const router: Router = express.Router()

router.delete('/:id', deleteUser)
// router.delete('/:id', verifyToken, deleteUser)
router.get('/:id', getUser)

export default router