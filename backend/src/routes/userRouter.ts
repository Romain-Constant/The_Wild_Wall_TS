import express from 'express'
import * as userController from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/authMiddleware'

// Create an instance of the Express Router
const userRouter = express.Router()

// Public route
userRouter.post('/register', userController.registerUser)

// Middleware to verify JWT token for subsequent routes
userRouter.use(authMiddleware)

// Authenticated routes
userRouter.get('/', userController.getAllUsers)
userRouter.put('/:id', userController.editUserRole)
userRouter.delete('/:id', userController.deleteUser)

// Export the user router for use in the application
export default userRouter
