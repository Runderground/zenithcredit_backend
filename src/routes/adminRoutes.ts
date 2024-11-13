import express from 'express'
import { getAllAdmins, createAdmin, loginAdmin } from '../controllers/adminControllers'
import { authenticateJWT } from '../middleware/Auth'

const router = express.Router()

// Rotas públicas

router.post("/login", loginAdmin)


// Rotas privadas

router.post("/register", createAdmin)
router.get("/", getAllAdmins)

export default router