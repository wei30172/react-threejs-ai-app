import { NextFunction, Response } from 'express'
import createError from '../utils/createError'
import Conversation from '../models/conversation.model'
import { IRequest } from '../middleware/authMiddleware'

// @desc    Create Conversation
// @route   POST /api/conversations
// @access  Private
export const createConversation = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  const { userId, isSeller, body: { to } } = req
  if (!userId || !to) return next(createError(400, 'Invalid parameters'))

  const newConversation = new Conversation({
    id: isSeller ? userId + to : to + userId, // sellerId + buyerId
    sellerId: isSeller ? userId : to,
    buyerId: isSeller ? to : userId,
    readBySeller: isSeller,
    readByBuyer: !isSeller
  })

  try {
    const savedConversation = await newConversation.save()
    res.status(201).send(savedConversation)
  } catch (err) {
    next(err)
  }
}

// @desc    Update Conversation
// @route   PUT /api/conversations/:id
// @access  Private
export const updateConversation = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  const { params: { id }, isSeller } = req
  if (!id) return next(createError(400, 'Invalid parameters'))

  try {
    const conversation = await Conversation.findOne({ id })

    if (!conversation) return next(createError(404, 'Conversation not found'))

    const updatedConversation = await Conversation.findOneAndUpdate(
      { id },
      {
        $set: {
          ...(isSeller 
            ? { readBySeller: !conversation?.readBySeller } 
            : { readByBuyer: !conversation?.readByBuyer })
        }
      },
      { new: true }
    )

    res.status(200).send(updatedConversation)
  } catch (err) {
    next(err)
  }
}

// @desc    Get Single Conversation
// @route   GET /api/conversations/single/:id
// @access  Private

export const getSingleConversation = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  const { params: { id } } = req

  if (!id) return next(createError(400, 'Invalid parameters'))

  try {
    const conversation = await Conversation.findOne({ id })
    if (!conversation) return next(createError(404, 'Conversation not found'))
    res.status(200).send(conversation)
  } catch (err) {
    next(err)
  }
}

// @desc    Get Conversations
// @route   GET /api/conversations
// @access  Private
export const getConversations = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  const { userId, isSeller } = req

  try {
    const conversations = await Conversation.find(
      isSeller ? { sellerId: userId } : { buyerId: userId }
    ).sort({ updatedAt: -1 })
    res.status(200).send(conversations)
  } catch (err) {
    next(err)
  }
}