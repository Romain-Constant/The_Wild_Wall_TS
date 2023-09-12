import { Request, Response } from 'express'
import * as postModel from '../models/post.model'
import Post from 'types/post.type'

const handleResponse = (res: Response, statusCode: number, message: string) => {
  return res.status(statusCode).json({ message })
}

const handleUnexpectedError = (res: Response) => {
  return handleResponse(res, 500, 'Internal server error.')
}

export const getAllPosts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const posts: Post[] = await postModel.findAllPosts()

    if (posts.length === 0) {
      return handleResponse(res, 404, 'No post found')
    }

    return res.status(200).json({ data: posts })
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}

export const getAllArchivedPosts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const posts: Post[] = await postModel.findAllArchivedPosts()

    if (posts.length === 0) {
      return handleResponse(res, 404, 'No archived post found')
    }

    return res.status(200).json({ data: posts })
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}

export const getPostById = async (req: Request, res: Response): Promise<Response> => {
  const postId: number = parseInt(req.params.id, 10)
  try {
    const post: Post | null = await postModel.findPostById(postId)

    if (!post) {
      return handleResponse(res, 404, 'Post not found')
    }
    return res.status(200).json({ data: post })
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}

export const addPost = async (req: Request, res: Response): Promise<Response> => {
  const { userId, postText, colorCode } = req.body

  if (!userId || !postText || !colorCode) {
    return res.status(400).json({ message: 'User ID, post text and color code are required.' })
  }

  try {
    const result = await postModel.addPost(userId, postText, colorCode)
    return res.status(201).json({ success: `New post created!`, result })
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}

export const editPost = async (req: Request, res: Response): Promise<Response> => {
  const { postId, postText, colorCode } = req.body

  if (!postId || !postText || !colorCode) {
    return res.status(400).json({ message: 'Post ID, post text and color code are required.' })
  }

  try {
    const result = await postModel.editPost(postId, postText, colorCode)
    return res.status(200).json({ success: `Post modified!`, result })
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}

export const archivePost = async (req: Request, res: Response): Promise<Response> => {
  const postId: number = parseInt(req.params.id, 10)

  try {
    const result = await postModel.archivePost(postId)
    return res.status(200).json({ success: `Post archived!`, result })
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}

export const deletePost = async (req: Request, res: Response): Promise<Response> => {
  const postId: number = parseInt(req.params.id, 10)

  try {
    const result = await postModel.deletePost(postId)
    return res.status(200).json({ success: `Post deleted!`, result })
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}
