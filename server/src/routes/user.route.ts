import express, { Router } from 'express'
import { verifyToken } from '../middleware/authMiddleware'
import { getUserInfo, deleteUser, getUserProfile, updateUserProfile } from '../controllers/user.controller'

const router: Router = express.Router()

router.route('/profile')
  .get(verifyToken, getUserProfile)
  .delete(verifyToken, deleteUser)
  .put(verifyToken, updateUserProfile)

router.get('/:id', getUserInfo)

export default router