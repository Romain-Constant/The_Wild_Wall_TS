import { Request, Response } from 'express'
import User from 'types/user.type'
import * as bcrypt from 'bcrypt'
import * as userModel from '../models/user.model'

const handleResponse = (res: Response, statusCode: number, message: string) => {
  return res.status(statusCode).json({ message })
}

const handleUnexpectedError = (res: Response) => {
  return handleResponse(res, 500, 'Internal server error.')
}

export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users: User[] = await userModel.findAllUsers()

    if (users.length === 0) {
      return handleResponse(res, 404, 'No user found')
    }

    return res.status(200).json({ data: users })
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}

export const getUserById = async (req: Request, res: Response): Promise<Response> => {
  const userId: number = parseInt(req.params.id, 10)
  try {
    const user: User | null = await userModel.findUserById(userId)
    if (!user) {
      return handleResponse(res, 404, 'User not found')
    }
    return res.status(200).json({ data: user })
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}

export const getUserByUsername = async (req: Request, res: Response): Promise<Response> => {
  const { username } = req.body
  try {
    const user: User | null = await userModel.findUserByUsername(username)
    if (!user) {
      return handleResponse(res, 404, 'User not found')
    }
    return res.status(200).json({ data: user })
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' })
  }

  try {
    // Check if the user already exists in the database
    const existingUser: User | null = await userModel.findUserByUsername(username)
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists.' })
    }

    // If the user does not exist, proceed with registration
    const hashedPassword: string = await bcrypt.hash(password, 10)
    const newUser: User = { username, password: hashedPassword }

    const result = await userModel.insertUser(newUser)
    return res.status(201).json({ success: `New user ${username} created!`, result })
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}

export const editUserRole = async (req: Request, res: Response): Promise<Response> => {
  const { name } = req.body.role

  const roleCodeMap: { [key: string]: string } = {
    admin: '1',
    delegate: '2',
    wilder: '3'
  }

  const roleCode: string | undefined = roleCodeMap[name]

  if (!roleCode) {
    return res.status(400).json({ message: 'Invalid role name.' })
  }

  const userId: number = parseInt(req.params.id, 10)

  try {
    const result = await userModel.updateRole(userId, roleCode)

    if (result.affectedRows === 0) {
      return res.sendStatus(404)
    }

    return res.status(200).json({ message: 'Update successful.' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Update not possible. Unknown role.' })
  }
}

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  const userId: number = parseInt(req.params.id, 10)

  try {
    // Vérifiez d'abord si l'utilisateur existe
    const user: User | null = await userModel.findUserById(userId)

    if (!user) {
      return handleResponse(res, 404, 'User not found')
    }

    // Si l'utilisateur existe, procédez à sa suppression
    const result = await userModel.deleteUser(userId)

    if (result.affectedRows > 0) {
      return res.status(200).json({ success: 'User deleted successfully' })
    } else {
      return res.status(500).json({ error: 'Failed to delete user' })
    }
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}
