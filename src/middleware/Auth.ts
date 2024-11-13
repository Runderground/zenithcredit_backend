import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const SECRET_KEY = process.env.JWT_KEY as string

interface CustomJwtPayload {
  id: string
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('authorization')?.split(' ')[1]

  if(!token) {
    res.status(401).json({message: "Token não fornecido"})
    return
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as CustomJwtPayload
    req.user = decoded;
    next()
  } catch(error) {
    res.status(403).json({error: "Token inválido ou expirado"})
  }
}