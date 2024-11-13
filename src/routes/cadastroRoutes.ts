import express from 'express'
import { FazerCadastro, ConsultarPorQueryUnique, DeleteUser, getAllCadastros } from '../controllers/cadastroControllers'

const router = express.Router()


router.get('/', getAllCadastros)

// Rota pública
router.post('/register', FazerCadastro)

//Rota privada

router.get('/find_user_unique', ConsultarPorQueryUnique)
router.delete('/delete/:id', DeleteUser)

export default router