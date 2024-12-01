import multer, { Multer } from 'multer'
import { S3Client, DeleteObjectCommand} from '@aws-sdk/client-s3'
import multerS3 from 'multer-s3'
import dotenv from 'dotenv'

dotenv.config()

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  }
})

export const deleteImageFromS3 = async(imageKey: string) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: imageKey
  }

  try {
    const command = new DeleteObjectCommand(params)
    const result = await s3.send(command)
    console.log('Imagem deletada com sucesso', result)
    return result
  } catch (error) {
    console.error('Erro ao deletar a imagem:', error)
    throw error
  }
}

const upload: Multer = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME || "",
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