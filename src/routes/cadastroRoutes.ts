import express from 'express'
import { FazerCadastro, ConsultarPorQueryUnique } from '../controllers/userControllers'
import cadastroModel from '../models/cadastroModel'

const router = express.Router()


router.get('/', async (req,res) => {
  const users = await cadastroModel.find()
  res.json(users)
})

// Rota pública
router.post('/register', FazerCadastro)

//Rota privada

router.get('/find_user_unique', ConsultarPorQueryUnique)

export default router