import express, { Router } from 'express'
import { verifyToken } from '../middleware/jwt'
import {
  createConversation,
  getConversations,
  getSingleConversation,
  updateConversation
} from '../controllers/conversation.controller'

const router: Router = express.Router()

router.get('/', verifyToken, getConversations)
router.post('/', verifyToken, createConversation)
router.get('/single/:id', verifyToken, getSingleConversation)
router.put('/:id', verifyToken, updateConversation)

export default router