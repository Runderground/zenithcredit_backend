"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cadastroControllers_1 = require("../controllers/cadastroControllers");
const cadastroModel_1 = __importDefault(require("../models/cadastroModel"));
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    const users = await cadastroModel_1.default.find();
    res.json(users);
});
// Rota pública
router.post('/register', cadastroControllers_1.FazerCadastro);
//Rota privada
router.get('/find_user_unique', cadastroControllers_1.ConsultarPorQueryUnique);
router.delete('/delete/:id', cadastroControllers_1.DeleteUser);
exports.default = router;
