import { Request, Response } from 'express'
import User from 'types/user.type'
import * as userModel from '../models/user.model'
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Controller function for user login
export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  // Extract username and password from the request body
  const { username, password } = req.body

  try {
    // Find the user by username in the database
    const user: User | null = await userModel.findUserByUsername(username)

    if (user) {
      // If the user is found, compare the provided password with the hashed password in the database
      const match: boolean = await bcrypt.compare(password, user.password)

      if (match) {
        // If passwords match, create a JWT token for authentication
        const { userId, role_code: roleCode } = user
        const jwtPassword = process.env.JWT_PASSWORD

        // Check if JWT secret key is defined
        if (!jwtPassword) {
          return res.status(500).json({ error: 'JWT secret key not defined.' })
        }

        // Sign the token with user information and set expiration time
        const token: string = jwt.sign({ userId, roleCode }, jwtPassword, {
          expiresIn: 3600 // Expires in 3600 seconds (1 hour)
        })

        // Set the token as a cookie in the response
        res.cookie('token', token, {
          httpOnly: true,
          expires: new Date(Date.now() + 60 * 60 * 1000) // Expires in 1 hour
        })

        // Return success response with user information
        return res.status(200).json({ username: user.username, roleCode, userId })
      } else {
        // If passwords do not match, return authentication failed with invalid password
        return res.status(401).json({ error: 'Authentication failed. Invalid password.' })
      }
    } else {
      // If user is not found, return authentication failed with user not found
      return res.status(401).json({ error: 'Authentication failed. User not found.' })
    }
  } catch (err) {
    // Handle server error and return internal server error response
    console.error(err)
    return res.status(500).json({ error: 'Internal server error.' })
  }
}

// Controller function for user logout
export const logout = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Clear the token cookie in the response
    res.clearCookie('token', { httpOnly: true })

    // Return success response with logout message
    return res.status(200).json({ message: 'Logout successful' })
  } catch (err) {
    // Handle error and return internal server error response
    console.error(err)
    return res.status(500).json({ error: 'Internal server error.' })
  }
}
