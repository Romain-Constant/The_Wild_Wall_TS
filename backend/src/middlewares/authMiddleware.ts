import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'

// Extend the Request type to add the user property
declare module 'express' {
  interface Request {
    user?: JwtPayload
  }
}

// Middleware for authentication
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Get the JWT secret key from the environment variables
  const jwtPassword = process.env.JWT_PASSWORD

  // Get the token from the cookies
  const token = req.cookies.token

  // If no token is present, respond with Unauthorized
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' })
  }

  // If JWT secret key is not defined, respond with Internal Server Error
  if (!jwtPassword) {
    res.status(500).json({ error: 'JWT secret key not defined.' })
  }

  try {
    // Verify the token using the JWT secret key
    const decodedToken = jwt.verify(token, jwtPassword as Secret) as JwtPayload

    // Add the decoded user information to the request object
    req.user = decodedToken

    // Move to the next middleware or route handler
    next()
  } catch (err) {
    console.error(err)

    // Handle token expiration
    if ((err as Error).name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Token expired.' })
    }

    // Handle other unexpected errors
    res.status(500).json({ error: 'Unexpected error.' })
  }
}
