import express from 'express'
import * as authController from '../controllers/auth.controller'

const authRouter = express.Router()

authRouter.post('/login', authController.loginUser)
authRouter.get('/logout', authController.logout)

export default authRouter
