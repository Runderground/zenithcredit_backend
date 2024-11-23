import multer, { Multer } from 'multer'
import { S3Client } from '@aws-sdk/client-s3'
import multerS3 from 'multer-s3'
import dotenv from 'dotenv'

dotenv.config()

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  }
})

const upload: Multer = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME || "",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname })
    },
    key: (req, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`
      cb(null, fileName)
    },
    contentType: multerS3.AUTO_CONTENT_TYPE
  }),
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: (req,file,cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
    if(allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Apenas arquivos PDF e imagens são permitidos"))
    }
  }
})

export default upload