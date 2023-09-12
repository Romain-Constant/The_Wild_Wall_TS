import express from 'express'
import * as userController from '../controllers/user.controller'

const userRouter = express.Router()

userRouter.get('/', userController.getAllUsers)
userRouter.get('/:id', userController.getUserById)
userRouter.post('/register', userController.registerUser)
userRouter.put('/:id', userController.editUserRole)
userRouter.delete('/:id', userController.deleteUser)

export default userRouter
