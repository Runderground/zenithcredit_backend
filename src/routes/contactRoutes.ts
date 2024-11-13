import express from 'express'
import { getAllContacts, createContact, changeStatus, deleteContact } from '../controllers/contactControllers'
import { authenticateJWT } from '../middleware/Auth'

const router = express.Router()

// Rotas públicas
router.post("/register", createContact)


// Rotas privadas
router.patch("/changestatus/:id", authenticateJWT, changeStatus)
router.delete("/delete/:id", authenticateJWT, deleteContact)
router.get("/", authenticateJWT, getAllContacts)

export default router