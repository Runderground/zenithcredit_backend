"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cadastroControllers_1 = require("../controllers/cadastroControllers");
const Auth_1 = require("../middleware/Auth");
const router = express_1.default.Router();
// Rotas públicas
router.post('/register', cadastroControllers_1.FazerCadastro);
//Rotas privadas
router.get('/find_user_unique', Auth_1.authenticateJWT, cadastroControllers_1.ConsultarPorQueryUnique);
router.delete('/delete/:id', Auth_1.authenticateJWT, cadastroControllers_1.DeleteUser);
router.get('/', Auth_1.authenticateJWT, cadastroControllers_1.getAllCadastros);
router.get("/totalusers", Auth_1.authenticateJWT, cadastroControllers_1.CountUsers);
exports.default = router;
