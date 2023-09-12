import Post from '../types/post.type'
import connection from '../db-config'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

const executeQuery = <T>(queryString: string, params: (number | string)[] = []): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    connection.query(queryString, params, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result as T)
      }
    })
  })
}

export const findAllPosts = async (): Promise<Post[]> => {
  const queryString = `SELECT p.id AS postId, p.post_text AS postText, p.post_date AS postDate, s.statut_name AS statutName, u.id AS userID, u.username, c.color_code AS colorCode
    FROM post AS p
    JOIN ts_wild_wall.statut AS s ON p.statut_id = s.id
    JOIN ts_wild_wall.user AS u ON p.user_id = u.id
    JOIN ts_wild_wall.color AS c ON p.color_id = c.id
    WHERE p.statut_id = 1
    ;
    `
  const rows = await executeQuery<RowDataPacket[]>(queryString)

  const posts: Post[] = rows.map((row) => ({
    postId: row.postId,
    postText: row.postText,
    postDate: row.postDate,
    statutName: row.statutName,
    userId: row.userId,
    username: row.username,
    colorCode: row.colorCode
  }))
  return posts
}

export const findAllArchivedPosts = async (): Promise<Post[]> => {
  const queryString = `SELECT p.id AS postId, p.post_text AS postText, p.post_date AS postDate, s.statut_name AS statutName, u.id AS userID, u.username, c.color_code AS colorCode
      FROM post AS p
      JOIN ts_wild_wall.statut AS s ON p.statut_id = s.id
      JOIN ts_wild_wall.user AS u ON p.user_id = u.id
      JOIN ts_wild_wall.color AS c ON p.color_id = c.id
      WHERE p.statut_id = 2
      ;
      `
  const rows = await executeQuery<RowDataPacket[]>(queryString)

  const posts: Post[] = rows.map((row) => ({
    postId: row.postId,
    postText: row.postText,
    postDate: row.postDate,
    statutName: row.statutName,
    userId: row.userId,
    username: row.username,
    colorCode: row.colorCode
  }))
  return posts
}

export const findPostById = async (postId: number): Promise<Post | null> => {
  const queryString = `SELECT p.id AS postId, p.post_text AS postText, p.post_date AS postDate, s.statut_name AS statutName, u.id AS userID, u.username, c.color_code AS colorCode
    FROM post AS p
    JOIN ts_wild_wall.statut AS s ON p.statut_id = s.id
    JOIN ts_wild_wall.user AS u ON p.user_id = u.id
    JOIN ts_wild_wall.color AS c ON p.color_id = c.id
    WHERE p.id = ?`
  const rows = await executeQuery<RowDataPacket[]>(queryString, [postId])
  if (rows.length === 0) {
    return null
  }
  const row = rows[0]
  const post: Post = {
    postId: row.postId,
    postText: row.postText,
    postDate: row.postDate,
    statutName: row.statutName,
    userId: row.userId,
    username: row.username,
    colorCode: row.colorCode
  }
  return post
}

export const addPost = async (userId: string, postText: string, colorCode: string): Promise<ResultSetHeader> => {
  let colorId: number

  switch (colorCode) {
    case '#c7ebb3':
      colorId = 1
      break
    case '#ffd5f8':
      colorId = 2
      break
    case '#c5e8f1':
      colorId = 3
      break
    case '#f8eaae':
      colorId = 4
      break
    default:
      colorId = 1
      break
  }

  const queryString = `INSERT INTO post (post_text, post_date, statut_id, user_id, color_id) 
  VALUES (?, NOW(), 1, ?, ?)`
  const params = [postText, userId, colorId]
  return await executeQuery<ResultSetHeader>(queryString, params)
}

export const editPost = async (postId: number, postText: string, colorCode: string): Promise<ResultSetHeader> => {
  let colorId: number

  switch (colorCode) {
    case '#c7ebb3':
      colorId = 1
      break
    case '#ffd5f8':
      colorId = 2
      break
    case '#c5e8f1':
      colorId = 3
      break
    case '#f8eaae':
      colorId = 4
      break
    default:
      colorId = 1
      break
  }

  const queryString = `UPDATE post SET post_text = ?, color_id = ?, post_date = NOW() WHERE id = ?`
  const params = [postText, colorId, postId]
  return await executeQuery<ResultSetHeader>(queryString, params)
}

export const archivePost = async (postId: number): Promise<ResultSetHeader> => {
  const queryString = `UPDATE post SET statut_id = 2 WHERE id = ?`

  return await executeQuery<ResultSetHeader>(queryString, [postId])
}

export const deletePost = async (postId: number): Promise<ResultSetHeader> => {
  const queryString = `DELETE FROM post WHERE id = ?`

  return await executeQuery<ResultSetHeader>(queryString, [postId])
}
