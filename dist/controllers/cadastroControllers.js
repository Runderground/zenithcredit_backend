"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCadastro = exports.CountUsers = exports.DeleteUser = exports.ConsultarPorQueryUnique = exports.FazerCadastro = exports.getAllCadastros = void 0;
const cadastroModel_1 = __importDefault(require("../models/cadastroModel"));
const multer_1 = require("../config/multer");
const getAllCadastros = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    try {
        const cadastros = await cadastroModel_1.default
            .find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const totalCadastros = await cadastroModel_1.default.countDocuments();
        if (!cadastros) {
            res.status(404).json({ error: "Não há contatos ou não consegui achar" });
            return;
        }
        res.status(200).json({
            cadastros,
            totalPages: Math.ceil(totalCadastros / limit),
            currentPage: page,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Ocorreu algum erro com o servidor");
    }
};
exports.getAllCadastros = getAllCadastros;
const FazerCadastro = async (req, res) => {
    const { values } = req.body;
    if (!values) {
        res
            .status(400)
            .json({
            error: "Está faltando alguns dos campos. Verifique e tente novamente.",
        });
        return;
    }
    if (!req.file) {
        res
            .status(400)
            .json({
            error: "Não foi possível fazer o cadastro. Verifique se o arquivo foi enviado corretamente.",
        });
        return;
    }
    const invalid_email = await cadastroModel_1.default.findOne({ email: values.email });
    if (invalid_email) {
        res
            .status(400)
            .json({ error: "Este email já está registrado, tente outro." });
        return;
    }
    const invalid_cpf = await cadastroModel_1.default.findOne({ cpf: values.cpf });
    if (invalid_cpf) {
        res
            .status(400)
            .json({ error: "Este CPF já está registrado, tente outro." });
        return;
    }
    const invalid_telefone = await cadastroModel_1.default.findOne({
        telefone: values.telefone,
    });
    if (invalid_telefone) {
        res
            .status(400)
            .json({ error: "Este telefone já está registrado, tente outro." });
        return;
    }
    try {
        const cadastro = new cadastroModel_1.default({
            nome: values.nome,
            email: values.email,
            telefone: values.telefone,
            cpf: values.cpf,
            cep: values.cep,
            nascimento: values.nascimento,
            renda: values.renda,
            ocupacao: values.ocupacao,
            garantia: values.garantia,
            motivo: values.motivo,
            documentos: [],
        });
        await cadastro.save();
        res
            .status(201)
            .json({
            success: "Seus documentos foram enviados com sucesso, nossos consultores entrarão em conta o mais breve possível.",
        });
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
const DeleteUser = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(404).json({ error: "Usuário não encontrado ou existente." });
        return;
    }
    const user = await cadastroModel_1.default.findById(id);
    if (!user) {
        res.status(404).json({ error: "Usuário não encontrado ou existente." });
        return;
    }
    try {
        const deletarIdentidade = await (0, multer_1.deleteImageFromS3)(user?.documentos[0].identidade[0].key);
        console.log(deletarIdentidade);
        const deletarRenda = await (0, multer_1.deleteImageFromS3)(user?.documentos[0].comprovante_renda[0].key);
        console.log(deletarRenda);
        const deletarResidencia = await (0, multer_1.deleteImageFromS3)(user?.documentos[0].residencia[0].key);
        console.log(deletarResidencia);
        await cadastroModel_1.default.findByIdAndDelete(id);
        res.status(200).json({ success: "Usuário deletado com sucesso." });
    }
    catch (err) {
        res.status(500).json("Ocorreu algum erro com o servidor");
        console.error(err);
    }
};
exports.DeleteUser = DeleteUser;
const CountUsers = async (req, res) => {
    const usersCount = await cadastroModel_1.default.countDocuments();
    res.json(usersCount);
};
exports.CountUsers = CountUsers;
const updateCadastro = async (req, res) => {
    const { id } = req.params;
    const { type } = req.query;
    const user = cadastroModel_1.default.findOne({ _id: id });
    const { value } = req.body;
    console.log(value);
    console.log(type);
    if (!id) {
        res.status(400).json({ error: "ID não fornecido" });
    }
    if (!user) {
        res.status(404).json({ error: "Usuário não encontrado ou existente." });
        return;
    }
    if (!type) {
        res.status(400).json({ error: "Tipo não definido..." });
        return;
    }
    if (!value) {
        res.status(400).json({ error: "Valor não definido..." });
        return;
    }
    if (type === "nome") {
        await user.updateOne({ nome: value });
        res.status(200).json({ success: "Nome atualizado com sucesso" });
        return;
    }
    else if (type === "email") {
        const invalid_email = await cadastroModel_1.default.findOne({ email: value });
        if (invalid_email) {
            res.status(400).json({ error: "Já existe um cadastro com este email, tente utilizar outro." });
            return;
        }
        await user.updateOne({ email: value });
        res.status(200).json({ success: "Email atualizado com sucesso" });
        return;
    }
    else if (type === "telefone") {
        const invalid_telefone = await cadastroModel_1.default.findOne({ telefone: value });
        if (invalid_telefone) {
            res.status(400).json({ error: "Já existe um cadastro com este telefone, tente utilizar outro." });
            return;
        }
        await user.updateOne({ telefone: value });
        res.status(200).json({ success: "Telefone atualizado com sucesso" });
        return;
    }
    else if (type === "cpf") {
        const invalid_cpf = await cadastroModel_1.default.findOne({ cpf: value });
        if (invalid_cpf) {
            res.status(400).json({ error: "Já existe um cadastro com este CPF, tente utilizar outro." });
            return;
        }
        await user.updateOne({ cpf: value });
        res.status(200).json({ success: "CPF atualizado com sucesso" });
        return;
    }
    else if (type === "nascimento") {
        await user.updateOne({ nascimento: value });
        res.status(200).json({ success: "Nascimento atualizado com sucesso" });
        return;
    }
    else if (type === "cep") {
        await user.updateOne({ cep: value });
        res.status(200).json({ success: "Cep atualizado com sucesso" });
        return;
    }
    else if (type === "renda") {
        await user.updateOne({ renda: value });
        res.status(200).json({ success: "Renda atualizado com sucesso" });
        return;
    }
    else if (type === "ocupacao") {
        await user.updateOne({ ocupacao: value });
        res.status(200).json({ success: "Ocupação atualizado com sucesso" });
        return;
    }
    else if (type === "motivo") {
        await user.updateOne({ motivo: value });
        res.status(200).json({ success: "Motivo atualizado com sucesso" });
        return;
    }
    else if (type === "garantia") {
        await user.updateOne({ garantia: value });
        res.status(200).json({ success: "Nome atualizado com sucesso" });
        return;
    }
};
exports.updateCadastro = updateCadastro;
// 6744e1c7d2a298165cc16cd7
