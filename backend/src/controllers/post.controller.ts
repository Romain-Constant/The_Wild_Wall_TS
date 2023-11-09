import { Request, Response } from 'express'
import * as postModel from '../models/post.model'
import Post from 'types/post.type'

const handleUnexpectedError = (res: Response) => {
  return res.status(500).json({ error: 'Internal server error.' })
}

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

export const addPost = async (req: Request, res: Response): Promise<Response> => {
  const { userId, postText, colorCode } = req.body

  if (!userId || !postText || !colorCode) {
    return res.status(400).json({ error: 'User ID, post text, and color code are required.' })
  }

  try {
    // Tu peux maintenant accéder à req.user directement sans vérifier manuellement le token
    console.log(req.user)

    // Tu peux également utiliser userId à partir de req.user au lieu de décoder manuellement le token
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

export const editPost = async (req: Request, res: Response): Promise<Response> => {
  const { postId, postText, colorCode } = req.body

  if (!postId || !postText || !colorCode) {
    return res.status(400).json({ error: 'User ID, post text and color code are required.' })
  }

  try {
    // Obtenez le post en utilisant postId
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

export const archivePost = async (req: Request, res: Response): Promise<Response> => {
  const postId: number = parseInt(req.params.id, 10)

  try {
    // Obtenez le post en utilisant postId
    const post: Post | null = await postModel.findPostById(postId)

    if (!post) {
      return res.status(404).json({ error: 'No post found' })
    }

    // Vérifiez si le roleCode est "4004" ou "5067" ou si l'userId correspond au post
    if (req.user?.roleCode === '4004' || req.user?.roleCode === '2013' || req.user?.userId === post.userId) {
      // L'utilisateur a les autorisations nécessaires, vous pouvez maintenant archiver le post
      const result = await postModel.archivePost(postId)
      return res.status(200).json({ success: `Post archived!`, result })
    } else {
      // L'utilisateur n'a pas les autorisations nécessaires
      return res.status(403).json({ error: 'Forbidden' })
    }
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}

export const deletePost = async (req: Request, res: Response): Promise<Response> => {
  const postId: number = parseInt(req.params.id, 10)

  try {
    // Obtenez le post en utilisant postId
    const post: Post | null = await postModel.findPostById(postId)

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    // Vérifiez si le roleCode est "4004" ou "2013" ou si l'userId correspond au post
    if (req.user?.roleCode === '4004' || req.user?.roleCode === '2013' || req.user?.userId === post.userId) {
      // L'utilisateur a les autorisations nécessaires, vous pouvez maintenant supprimer le post
      const result = await postModel.deletePost(postId)
      return res.status(200).json({ success: `Post deleted!`, result })
    } else {
      // L'utilisateur n'a pas les autorisations nécessaires
      return res.status(403).json({ error: 'Forbidden' })
    }
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}
