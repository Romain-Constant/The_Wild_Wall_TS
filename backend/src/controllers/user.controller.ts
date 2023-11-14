import { Request, Response } from 'express'
import User from 'types/user.type'
import * as bcrypt from 'bcrypt'
import * as userModel from '../models/user.model'

const handleUnexpectedError = (res: Response) => {
  return res.status(500).json({ error: 'Internal server error.' })
}

export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users: User[] = await userModel.findAllUsers()

    if (users.length === 0) {
      return res.status(404).json({ error: 'No user found' })
    }

    // Créez un nouveau tableau avec les propriétés spécifiques
    const simplifiedUsers = users.map((user) => ({
      userId: user.userId,
      username: user.username,
      role: user.role
    }))

    if (req.user?.roleCode !== '2013') {
      return res.status(403).json({ error: 'Forbidden' })
    }

    return res.status(200).json(simplifiedUsers)
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' })
  }

  try {
    // Check if the user already exists in the database
    const existingUser: User | null = await userModel.findUserByUsername(username)
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists.' })
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
    return res.status(400).json({ error: 'Invalid role name.' })
  }

  const userId: number = parseInt(req.params.id, 10)

  try {
    // Check if the user exists in the database
    const user: User | null = await userModel.findUserById(userId)

    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }

    // If the user exists, proceed with update
    if (req.user?.roleCode !== '2013') {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const result = await userModel.updateRole(userId, roleCode)

    if (result.affectedRows === 0) {
      return res.status(500).json({ error: 'Update not possible. Unknown role.' })
    }

    return res.status(200).json({ message: 'Update successful.' })
  } catch (err) {
    console.error(err)
    return handleUnexpectedError(res)
  }
}

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  const userId: number = parseInt(req.params.id, 10)

  try {
    if (req.user?.roleCode !== '2013') {
      return res.status(403).json({ error: 'Forbidden' })
    }

    // Check if the user exists in the database
    const user: User | null = await userModel.findUserById(userId)

    if (!user) {
      return res.status(404).json({ error: 'No user found' })
    }

    // If the user exists, proceed with deletion
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
