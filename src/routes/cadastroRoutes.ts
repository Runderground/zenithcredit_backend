import express from 'express'
import { FazerCadastro } from '../controllers/userControllers'
import cadastroModel from '../models/cadastroModel'

const router = express.Router()


router.get('/', async (req,res) => {
  const users = await cadastroModel.find()
  res.json(users)
})

router.post('/register', FazerCadastro)

export default router