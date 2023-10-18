import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const jwtPassword = process.env.JWT_PASSWORD
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!jwtPassword) {
    return res.status(500).json({ error: 'JWT secret key not defined.' })
  }

  try {
    const decodedToken = jwt.verify(token, jwtPassword)
    ;(req as any).decodedToken = decodedToken // Stockez le token décodé dans l'objet de demande pour une utilisation ultérieure.
    next()
  } catch (err) {
    if ((err as Error).name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' })
    }
    return res.status(500).json({ error: 'Internal server error.' })
  }

  // Ajoutez une clause return ici pour renvoyer une réponse par défaut
  return res.status(500).json({ error: 'Internal server error.' })
}
