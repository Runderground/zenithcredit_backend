import multer, { Multer } from 'multer'
import path from "path"
import { Request } from 'express'
import multerS3 from 'multer-s3'
import AWS from 'aws-sdk'
import dotenv from 'dotenv'
const allowedTypes = ["images/jpeg", "images/png", "images/jpg", "application/pdf"]

dotenv.config()

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../../uploads')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `${uniqueSuffix}-${file.originalname}`)
  }
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if(allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Tipo de arquivo não suportado"))
  }
}

const upload: Multer = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter,
})

export default upload