import dotenv from 'dotenv'
import cors from 'cors'

import express from 'express'
import thingRouter from './routes/thingRouter'
import userRouter from './routes/userRouter'
import authRouter from './routes/authRouter'
import postRouter from './routes/postRouter'
dotenv.config()

const app = express()

app.use(express.json())
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    optionsSuccessStatus: 200
  })
)

app.use('/things', thingRouter)
app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use('/posts', postRouter)

app.listen(process.env.APP_PORT, () => {
  console.log(`Server listening on port ${process.env.APP_PORT}`)
})
