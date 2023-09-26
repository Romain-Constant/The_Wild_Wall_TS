import { Request, Response } from 'express'
import User from 'types/user.type'
import * as userModel from '../models/user.model'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body

  try {
    const user: User | null = await userModel.findUserByUsername(username)

    if (user) {
      const match: boolean = await bcrypt.compare(password, user.password)

      if (match) {
        const { userId, role_code: roleCode } = user
        const jwtPassword = process.env.JWT_PASSWORD

        if (!jwtPassword) {
          return res.status(500).json({ error: 'JWT secret key not defined.' })
        }

        const token: string = jwt.sign({ userId, roleCode }, jwtPassword, {
          expiresIn: 300
        })

        res.cookie('token', token, {
          httpOnly: true,
          expires: new Date(Date.now() + 60 * 60 * 1000) // Expires in 1 hour
        })

        return res.status(200).json({ username: user.username, roleCode, userId })
      } else {
        // Mot de passe incorrect
        return res.status(401).json({ error: 'Authentication failed. Invalid password.' })
      }
    } else {
      // Utilisateur non trouvé
      return res.status(401).json({ error: 'Authentication failed. User not found.' })
    }
  } catch (err) {
    // Erreur serveur
    console.error(err)
    return res.status(500).json({ error: 'Internal server error.' })
  }
}

export const logout = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Effacez le cookie du token
    res.clearCookie('token', { httpOnly: true })

    // Répondez avec un message de déconnexion réussie
    return res.status(200).json({ message: 'Logout successful' })
  } catch (err) {
    // En cas d'erreur, répondez avec une erreur serveur
    console.error(err)
    return res.status(500).json({ error: 'Internal server error.' })
  }
}
