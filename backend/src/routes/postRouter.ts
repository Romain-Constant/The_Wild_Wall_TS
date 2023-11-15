import express from 'express'
import * as postController from '../controllers/post.controller'
import { authMiddleware } from '../middlewares/authMiddleware'

// Create an instance of the Express Router
const postRouter = express.Router()

// Public routes
postRouter.get('/', postController.getAllPosts)
postRouter.get('/archived', postController.getAllArchivedPosts)
postRouter.get('/:id', postController.getPostById)

// Middleware to verify JWT token for subsequent routes
postRouter.use(authMiddleware)

// Authenticated routes
postRouter.post('/', postController.addPost)
postRouter.put('/', postController.editPost)
postRouter.put('/archive/:id', postController.archivePost)
postRouter.delete('/:id', postController.deletePost)

// Export the post router for use in the application
export default postRouter
