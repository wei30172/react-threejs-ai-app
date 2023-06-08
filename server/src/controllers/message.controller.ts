import { NextFunction, Request, Response } from 'express'
import Message from '../models/message.model'
import Conversation from '../models/conversation.model'
import { IRequest } from '../middleware/jwt'

export const createMessage = async (req: IRequest, res: Response, next: NextFunction) => {
  const newMessage = new Message({
    conversationId: req.body.conversationId,
    userId: req.userId,
    desc: req.body.desc
  })
  try {
    const savedMessage = await newMessage.save()
    await Conversation.findOneAndUpdate(
      { id: req.body.conversationId },
      {
        $set: {
          readBySeller: req.isSeller,
          readByBuyer: !req.isSeller,
          lastMessage: req.body.desc
        }
      },
      { new: true }
    )

    res.status(201).send(savedMessage)
  } catch (err) {
    next(err)
  }
}

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id })
    res.status(200).send(messages)
  } catch (err) {
    next(err)
  }
}