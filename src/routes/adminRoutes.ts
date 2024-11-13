import express from 'express'
import { getAllAdmins, createAdmin, loginAdmin, deleteAdmin } from '../controllers/adminControllers'
import { authenticateJWT } from '../middleware/Auth'

const router = express.Router()

// Rotas públicas

router.post("/login", loginAdmin)


// Rotas privadas

router.post("/register", authenticateJWT, createAdmin)
router.get("/", authenticateJWT, getAllAdmins)
router.delete("/delete/:id", authenticateJWT, deleteAdmin)

export default router