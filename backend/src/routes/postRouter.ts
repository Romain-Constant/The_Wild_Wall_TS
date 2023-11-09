import express from 'express'
import * as postController from '../controllers/post.controller'
import { authMiddleware } from '../middlewares/authMiddleware'

const postRouter = express.Router()

postRouter.get('/', postController.getAllPosts)
postRouter.get('/archived', postController.getAllArchivedPosts)
postRouter.get('/:id', postController.getPostById)

// verify jwt token before adding, editing, or deleting a post
postRouter.use(authMiddleware)

postRouter.post('/', postController.addPost)
postRouter.put('/', postController.editPost)
postRouter.put('/archive/:id', postController.archivePost)
postRouter.delete('/:id', postController.deletePost)

export default postRouter
