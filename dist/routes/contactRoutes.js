"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contactControllers_1 = require("../controllers/contactControllers");
const Auth_1 = require("../middleware/Auth");
const router = express_1.default.Router();
// Rotas públicas
router.post("/register", contactControllers_1.createContact);
// Rotas privadas
router.patch("/changestatus/:id", Auth_1.authenticateJWT, contactControllers_1.changeStatus);
router.delete("/delete/:id", Auth_1.authenticateJWT, contactControllers_1.deleteContact);
router.get("/", Auth_1.authenticateJWT, contactControllers_1.getAllContacts);
router.get("/totalusers", Auth_1.authenticateJWT, contactControllers_1.CountUsers);
exports.default = router;
