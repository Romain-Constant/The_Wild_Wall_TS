import express from 'express'
import * as authController from '../controllers/auth.controller'

// Create an instance of the Express Router
const authRouter = express.Router()

// Define routes for authentication
authRouter.post('/login', authController.loginUser) // Route for user login
authRouter.get('/logout', authController.logout) // Route for user logout

// Export the authentication router for use in the application
export default authRouter
