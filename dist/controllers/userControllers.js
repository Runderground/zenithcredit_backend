"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUser = exports.ConsultarPorQueryUnique = exports.FazerCadastro = void 0;
const cadastroModel_1 = __importDefault(require("../models/cadastroModel"));
const FazerCadastro = async (req, res) => {
    const { nome, email, telefone, cpf, cep, nascimento, renda, ocupacao, motivo, garantia } = req.body;
    if (!nome || !email || !telefone || !cpf || !cep || !nascimento || !renda || !ocupacao || !motivo || !garantia) {
        res.status(400).json({ error: 'Está faltando alguns dos campos. Verifique e tente novamente.' });
        return;
    }
    const invalid_email = await cadastroModel_1.default.findOne({ email: email });
    if (invalid_email) {
        res.status(400).json({ error: 'Este email já está registrado, tente outro.' });
        return;
    }
    const invalid_cpf = await cadastroModel_1.default.findOne({ cpf: cpf });
    if (invalid_cpf) {
        res.status(400).json({ error: 'Este CPF já está registrado, tente outro.' });
        return;
    }
    const invalid_telefone = await cadastroModel_1.default.findOne({ telefone: telefone });
    if (invalid_telefone) {
        res.status(400).json({ error: 'Este telefone já está registrado, tente outro.' });
        return;
    }
    try {
        const cadastro = new cadastroModel_1.default({
            nome: nome,
            email: email,
            telefone: telefone,
            cpf: cpf,
            cep: cep,
            nascimento: nascimento,
            renda: renda,
            ocupacao: ocupacao,
            garantia: garantia,
            motivo: motivo
        });
        await cadastro.save();
        res.status(201).json({ success: "Seu cadastro foi feito com sucesso." });
    }
    catch (err) {
        res.status(500).json("Ocorreu algum erro com o servidor");
        console.error(err);
    }
};
exports.FazerCadastro = FazerCadastro;
const ConsultarPorQueryUnique = async (req, res) => {
    const { id, email, cpf, telefone } = req.query;
    if (id) {
        const User = await cadastroModel_1.default.findOne({ _id: id });
        if (!User) {
            res.status(404).json({ error: "Usuário não encontrado ou existente." });
            return;
        }
        res.json(User);
    }
    if (email) {
        const User = await cadastroModel_1.default.findOne({ email: email });
        if (!User) {
            res.status(404).json({ error: "Usuário não encontrado ou existente." });
            return;
        }
        res.json(User);
    }
    if (cpf) {
        const User = await cadastroModel_1.default.findOne({ cpf: cpf });
        if (!User) {
            res.status(404).json({ error: "Usuário não encontrado ou existente." });
            return;
        }
        res.json(User);
    }
    if (telefone) {
        const User = await cadastroModel_1.default.findOne({ telefone: telefone });
        if (!User) {
            res.status(404).json({ error: "Usuário não encontrado ou existente." });
            return;
        }
        res.json(User);
    }
};
exports.ConsultarPorQueryUnique = ConsultarPorQueryUnique;
const DeleteUser = (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "Usuário não encontrado ou existente." });
        return;
    }
    try {
        cadastroModel_1.default.findByIdAndDelete(id);
        res.status(200).json({ success: "Usuário deletado com sucesso." });
    }
    catch (err) {
        res.status(500).json("Ocorreu algum erro com o servidor");
        console.error(err);
    }
};
exports.DeleteUser = DeleteUser;
