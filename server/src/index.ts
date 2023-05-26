import express, { ErrorRequestHandler } from 'express'
import connectDB from './connect'
import * as dotenv from 'dotenv'
import cors from 'cors'

// Routes
import userRoute from './routes/user.route'
import gigRoute from './routes/gig.route'
import orderRoute from './routes/order.route'
import conversationRoute from './routes/conversation.route'
import messageRoute from './routes/message.route'
import reviewRoute from './routes/review.route'
import authRoute from './routes/auth.route'
import postRoutes from './routes/post.routes'
import dalleRoutes from './routes/dalle.routes'

const app = express()
dotenv.config()

app.use(cors({ origin: 'http://localhost:5173', credentials: true })) // todo
app.use(express.json({ limit: '50mb' }))

app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/gigs', gigRoute)
app.use('/api/orders', orderRoute)
app.use('/api/conversations', conversationRoute)
app.use('/api/messages', messageRoute)
app.use('/api/reviews', reviewRoute)
app.use('/api/post', postRoutes)
app.use('/api/dalle', dalleRoutes)

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello from SERVER'
  })
})

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL!)
    app.listen(8080, () => console.log('Server started on port 8080'))
  } catch (err) {
    console.error(err)
  }
}

startServer()

const errorHandler: ErrorRequestHandler = (err, req, res) => {
  console.error(err.stack)
  res.status(500).send('Something went wrong!')
}

app.use(errorHandler)