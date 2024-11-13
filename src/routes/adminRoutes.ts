import express from 'express'
import { getAllAdmins, createAdmin, loginAdmin, deleteAdmin, tokenVerified, CountUsers } from '../controllers/adminControllers'
import { authenticateJWT } from '../middleware/Auth'

const router = express.Router()

// Rotas públicas

router.post("/login", loginAdmin)


// Rotas privadas

router.post("/register", authenticateJWT, createAdmin)
router.get("/", authenticateJWT, getAllAdmins)
router.get("/totalusers", authenticateJWT, CountUsers)
router.delete("/delete/:id", authenticateJWT, deleteAdmin)
router.get("/verify", authenticateJWT, tokenVerified)

export default router