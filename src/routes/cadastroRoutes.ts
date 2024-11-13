import express from 'express'
import { FazerCadastro, ConsultarPorQueryUnique, DeleteUser, getAllCadastros, CountUsers } from '../controllers/cadastroControllers'
import { authenticateJWT } from '../middleware/Auth'

const router = express.Router()

// Rotas públicas
router.post('/register', FazerCadastro)

//Rotas privadas

router.get('/find_user_unique', authenticateJWT, ConsultarPorQueryUnique)
router.delete('/delete/:id', authenticateJWT, DeleteUser)
router.get('/', authenticateJWT, getAllCadastros)
router.get("/totalusers", authenticateJWT, CountUsers)

export default router