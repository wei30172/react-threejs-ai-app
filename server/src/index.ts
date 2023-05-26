import express, { ErrorRequestHandler } from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'

import connectDB from './mongodb/connect'
// Import routes
import postRoutes from './routes/post.routes'
import dalleRoutes from './routes/dalle.routes'

// Load environment variables from .env file
const env = dotenv.config()

if (env.error) {
  throw new Error("Couldn't find .env file!")
}

// Initialize an express application
const app = express()

// Use CORS middleware to handle Cross-Origin Resource Sharing
app.use(cors())

// Middleware to parse JSON bodies. This line must be placed before the routes
app.use(express.json({ limit: "50mb" }))

app.use('/api/v1/post', postRoutes)
app.use("/api/v1/dalle", dalleRoutes)

// Define the base route
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Hello from SERVER"
  })
})

// Start the server
const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL!)
    app.listen(8080, () => console.log('Server started on port 8080'))
  } catch (err) {
    console.error(err)
  }
}

startServer()

// Use the error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something went wrong!')
}

app.use(errorHandler)