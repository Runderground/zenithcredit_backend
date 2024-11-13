"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeStatus = exports.deleteContact = exports.createContact = exports.getAllContacts = void 0;
const contactModel_1 = __importDefault(require("../models/contactModel"));
const getAllContacts = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    try {
        const contacts = await contactModel_1.default.find().skip(skip).limit(limit).sort({ createdAt: -1 });
        const totalContacts = await contactModel_1.default.countDocuments();
        if (!contacts) {
            res.status(404).json({ error: "Não há contatos ou não consegui achar" });
            return;
        }
        res.status(200).json({
            contacts,
            totalPages: Math.ceil(totalContacts / limit),
            currentPage: page,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Ocorreu algum erro com o servidor");
    }
};
exports.getAllContacts = getAllContacts;
const createContact = async (req, res) => {
    const { nome, email, telefone, comentario } = req.body;
    if (!nome || !email || !telefone) {
        res.status(400).json({ error: "Algum dos campos não foi preenchido." });
        return;
    }
    const email_invalid = await contactModel_1.default.findOne({ email: email });
    if (email_invalid) {
        res.status(400).json({ error: "Este email já está cadastrado." });
        return;
    }
    const telefone_invalid = await contactModel_1.default.findOne({ telefone: telefone });
    if (telefone_invalid) {
        res.status(400).json({ error: "Este telefone já está cadastrado." });
        return;
    }
    try {
        const newContact = new contactModel_1.default({
            nome: nome,
            email: email,
            telefone: telefone,
            comentario: comentario
        });
        await newContact.save();
        res.status(201).json({ success: "Contato enviado com sucesso para nossos atendentes." });
    }
    catch (error) {
        res.status(500).json("Ocorreu algum erro com o servidor");
        console.error(error);
    }
};
exports.createContact = createContact;
const deleteContact = async (req, res) => {
    const { id } = req.params;
    const user = await contactModel_1.default.findOne({ _id: id });
    if (!user) {
        res.status(404).json({ error: "Usuário não encontrado ou existente." });
        return;
    }
    try {
        await contactModel_1.default.findByIdAndDelete(id);
        res.status(200).json({ success: "Contato deletado com sucesso." });
    }
    catch (error) {
        res.status(500).json("Ocorreu algum erro com o servidor");
        console.error(error);
    }
};
exports.deleteContact = deleteContact;
const changeStatus = async (req, res) => {
    const { id } = req.params;
    const user = await contactModel_1.default.findOne({ _id: id });
    if (!user) {
        res.status(404).json({ error: "Usuário não encontrado ou existente." });
        return;
    }
    if (user.status === "Atendido") {
        user.status = "Pendente";
        await user.save();
        res.status(200).json(user);
    }
    else {
        user.status = "Atendido";
        await user.save();
        res.status(200).json(user);
    }
};
exports.changeStatus = changeStatus;
