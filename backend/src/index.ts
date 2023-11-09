import dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'
import userRouter from './routes/userRouter'
import authRouter from './routes/authRouter'
import postRouter from './routes/postRouter'

// load environment variables
dotenv.config()

// initialize express instance
const app = express()

// accept json entries
app.use(express.json())

// accept cors requests with credentials
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    optionsSuccessStatus: 200
  })
)

// accept cookies analysis in requests
app.use(cookieParser())

// define routes
app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use('/posts', postRouter)

// start server
app.listen(process.env.APP_PORT, () => {
  console.log(`Server listening on port ${process.env.APP_PORT}`)
})
