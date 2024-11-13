"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contactControllers_1 = require("../controllers/contactControllers");
const router = express_1.default.Router();
// Rotas públicas
router.get("/", contactControllers_1.getAllContacts);
router.post("/register", contactControllers_1.createContact);
// Rotas privadas
router.patch("/changestatus/:id", contactControllers_1.changeStatus);
router.delete("/delete/:id", contactControllers_1.deleteContact);
exports.default = router;
