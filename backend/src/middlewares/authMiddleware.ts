import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'

// Étendre le type Request pour ajouter la propriété user
declare module 'express' {
  interface Request {
    user?: JwtPayload
  }
}
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const jwtPassword = process.env.JWT_PASSWORD
  const token = req.cookies.token

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' })
  }

  if (!jwtPassword) {
    res.status(500).json({ error: 'JWT secret key not defined.' })
  }

  try {
    const decodedToken = jwt.verify(token, jwtPassword as Secret) as JwtPayload
    req.user = decodedToken
    next()
  } catch (err) {
    console.error(err)

    if ((err as Error).name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Token expired.' })
    }

    res.status(500).json({ error: 'Unexpected error.' })
  }
}
