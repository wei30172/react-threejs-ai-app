import { Router, NextFunction, Request, Response } from 'express'
import { Configuration, OpenAIApi } from 'openai'

import createError from '../utils/createError'
import * as dotenv from 'dotenv'

dotenv.config()

const router = Router()

// Create a new instance of OpenAI API
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config)

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from DALL-E!' })
})

// Generates the image
router.route('/').post(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt } = req.body
    if (!prompt) {
      return next(createError(400, 'Invalid prompt'))
    }

    // Use OpenAI API to create an image based on the 'prompt'
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json'
    })

    // Get the base64-encoded image from the response
    const image = response.data.data[0].b64_json

    // Respond with the image
    res.status(200).json(image)
  } catch (err) {
    console.error(`Error: ${err}`)
    next(err)
  }
})

export default router