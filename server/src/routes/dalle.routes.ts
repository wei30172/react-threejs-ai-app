import express from 'express'
import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const router = express.Router()

// Create a new instance of OpenAI API
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(config)

router.route('/').get((req, res) => {
  res.status(200).json({ message: "Hello from DALL-E!" })
})

// Generates the image
router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body
    if (!prompt) {
      return res.status(400).json({ message: "Invalid prompt" })
    }

    // Use OpenAI API to create an image based on the 'prompt'
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    })

    // Get the base64-encoded image from the response
    const image = response.data.data[0].b64_json

    // Respond with the image
    res.status(200).json({ photo: image })
  } catch (error) {
    console.error(`Error: ${error}`)
    res.status(500).json({ message: "Something went wrong" })
  }
})

export default router