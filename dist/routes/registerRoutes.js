"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cadastroModel_1 = require("../models/cadastroModel");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json('All users');
});
router.post('/register', async (req, res) => {
    const { nome, email, telefone, cpf, cep, nascimento, renda, ocupacao, motivo, garantia } = req.params;
    if (!nome || !email || !telefone || !cpf || !cep || !nascimento || !renda || !ocupacao || !motivo || !garantia) {
        res.status(400).json({ error: 'Está faltando alguns dos campos. Verifique e tente novamente.' });
        return;
    }
    const invalid_email = cadastroModel_1.cadastroModel.find;
});
exports.default = router;
