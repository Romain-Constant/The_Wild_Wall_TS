import { Request, Response } from 'express'
import * as postModel from '../models/post.model'
import Post from 'types/post.type'

// Function to handle unexpected errors and send a 500 Internal Server Error response
const handleUnexpectedError = (res: Response) => {
  return res.status(500).json({ error: 'Internal server error.' })
}

// Controller function to get all posts
export const getAllPosts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const posts: Post[] = await postModel.findAllPosts()

    if (posts.length === 0) {
      return res.status(404).json({ error: 'No post found' })
    }

    return res.status(200).json({ posts })
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}

// Controller function to get all archived posts
export const getAllArchivedPosts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const posts: Post[] = await postModel.findAllArchivedPosts()

    if (posts.length === 0) {
      return res.status(404).json({ error: 'No archived post found' })
    }

    return res.status(200).json({ posts })
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}

// Controller function to get a post by its ID
export const getPostById = async (req: Request, res: Response): Promise<Response> => {
  const postId: number = parseInt(req.params.id, 10)

  try {
    const post: Post | null = await postModel.findPostById(postId)

    if (!post) {
      return res.status(404).json({ error: 'No post found' })
    }

    return res.status(200).json({ post })
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}

// Controller function to add a new post
export const addPost = async (req: Request, res: Response): Promise<Response> => {
  const { userId, postText, colorCode } = req.body

  if (!userId || !postText || !colorCode) {
    return res.status(400).json({ error: 'User ID, post text, and color code are required.' })
  }

  try {
    // Use userId from req.user instead of manually decoding the token
    if (req.user?.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const result = await postModel.addPost(userId, postText, colorCode)
    return res.status(201).json({ success: 'New post created!', result })
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}

// Controller function to edit an existing post
export const editPost = async (req: Request, res: Response): Promise<Response> => {
  const { postId, postText, colorCode } = req.body

  if (!postId || !postText || !colorCode) {
    return res.status(400).json({ error: 'User ID, post text, and color code are required.' })
  }

  try {
    // Get the post using postId
    const post: Post | null = await postModel.findPostById(postId)

    if (!post) {
      return res.status(404).json({ error: 'No post found' })
    }

    if (req.user?.userId !== post.userId) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const result = await postModel.editPost(postId, postText, colorCode)
    return res.status(200).json({ success: 'Post modified!', result })
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}

// Controller function to archive a post
export const archivePost = async (req: Request, res: Response): Promise<Response> => {
  const postId: number = parseInt(req.params.id, 10)

  try {
    // Get the post using postId
    const post: Post | null = await postModel.findPostById(postId)

    if (!post) {
      return res.status(404).json({ error: 'No post found' })
    }

    // Check if roleCode is "4004" or "2013" or if userId matches the post's userId
    if (req.user?.roleCode === '4004' || req.user?.roleCode === '2013' || req.user?.userId === post.userId) {
      // User has necessary permissions, now archive the post
      const result = await postModel.archivePost(postId)
      return res.status(200).json({ success: `Post archived!`, result })
    } else {
      // User does not have necessary permissions
      return res.status(403).json({ error: 'Forbidden' })
    }
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}

// Controller function to delete a post
export const deletePost = async (req: Request, res: Response): Promise<Response> => {
  const postId: number = parseInt(req.params.id, 10)

  try {
    // Get the post using postId
    const post: Post | null = await postModel.findPostById(postId)

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    // Check if roleCode is "4004" or "2013" or if userId matches the post's userId
    if (req.user?.roleCode === '4004' || req.user?.roleCode === '2013' || req.user?.userId === post.userId) {
      // User has necessary permissions, now delete the post
      const result = await postModel.deletePost(postId)
      return res.status(200).json({ success: `Post deleted!`, result })
    } else {
      // User does not have necessary permissions
      return res.status(403).json({ error: 'Forbidden' })
    }
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}
