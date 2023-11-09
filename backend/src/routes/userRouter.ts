import express from 'express'
import * as userController from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/authMiddleware'

const userRouter = express.Router()

userRouter.post('/register', userController.registerUser)

// verify jwt token before getting, editing, or deleting a user
userRouter.use(authMiddleware)

userRouter.get('/', userController.getAllUsers)
userRouter.put('/:id', userController.editUserRole)
userRouter.delete('/:id', userController.deleteUser)

export default userRouter
