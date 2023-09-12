import express from 'express'
import * as postController from '../controllers/post.controller'

const postRouter = express.Router()

postRouter.get('/', postController.getAllPosts)
postRouter.get('/archived', postController.getAllArchivedPosts)
postRouter.get('/:id', postController.getPostById)
postRouter.post('/', postController.addPost)
postRouter.put('/', postController.editPost)
postRouter.put('/archive/:id', postController.archivePost)
postRouter.delete('/:id', postController.deletePost)

export default postRouter
