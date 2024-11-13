"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminControllers_1 = require("../controllers/adminControllers");
const Auth_1 = require("../middleware/Auth");
const router = express_1.default.Router();
// Rotas públicas
router.post("/login", adminControllers_1.loginAdmin);
// Rotas privadas
router.post("/register", Auth_1.authenticateJWT, adminControllers_1.createAdmin);
router.get("/", Auth_1.authenticateJWT, adminControllers_1.getAllAdmins);
router.delete("/delete/:id", Auth_1.authenticateJWT, adminControllers_1.deleteAdmin);
exports.default = router;
