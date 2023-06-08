import { NextFunction, Response } from 'express'
import createError from '../utils/createError'
import Conversation from '../models/conversation.model'
import { IRequest } from '../middleware/jwt'

export const createConversation = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  const newConversation = new Conversation({
    id: req.isSeller ? req.userId + req.body.to : req.body.to + req.userId, // sellerId + buyerId
    sellerId: req.isSeller ? req.userId : req.body.to,
    buyerId: req.isSeller ? req.body.to : req.userId,
    readBySeller: req.isSeller,
    readByBuyer: !req.isSeller
  })

  try {
    const savedConversation = await newConversation.save()
    res.status(201).send(savedConversation)
  } catch (err) {
    next(err)
  }
}

export const updateConversation = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const conversation = await Conversation.findOne({ id: req.params.id })

    const updatedConversation = await Conversation.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          ...(req.isSeller 
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

export const getSingleConversation = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const conversation = await Conversation.findOne({ id: req.params.id })
    if (!conversation) return next(createError(404, 'Conversation not found!'))
    res.status(200).send(conversation)
  } catch (err) {
    next(err)
  }
}

export const getConversations = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const conversations = await Conversation.find(
      req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }
    ).sort({ updatedAt: -1 })
    res.status(200).send(conversations)
  } catch (err) {
    next(err)
  }
}
