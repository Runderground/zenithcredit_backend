import express from 'express'
import { getAllContacts, createContact, changeStatus, deleteContact } from '../controllers/contactControllers'

const router = express.Router()

// Rotas públicas

router.get("/", getAllContacts)
router.post("/register", createContact)


// Rotas privadas
router.patch("/changestatus/:id", changeStatus)
router.delete("/delete/:id", deleteContact)


export default router