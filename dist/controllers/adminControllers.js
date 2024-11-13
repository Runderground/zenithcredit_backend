"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAdmins = exports.loginAdmin = exports.createAdmin = void 0;
const adminModel_1 = __importDefault(require("../models/adminModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createAdmin = async (req, res) => {
    const { nome, email, password } = req.body;
    if (!nome || !email || !password) {
        res.status(400).json({ error: "Algum dos campos está faltando... Verifique e tente novamente." });
        return;
    }
    const invalid_email = await adminModel_1.default.findOne({ email: email });
    if (invalid_email) {
        res.status(400).json({ error: "Já existe um administrador com este email. Tente utilizar outro." });
        return;
    }
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        const admin = await adminModel_1.default.create({
            nome: nome,
            email: email,
            password: hashedPassword
        });
        const newAdmin = await admin.save();
        const token = jsonwebtoken_1.default.sign(newAdmin._id, process.env.JWT_KEY, {
            expiresIn: '1d'
        });
        res.json(201).json({ token, success: "Administrador criado com sucesso!" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Ocorreu algum erro não esperado. Tente mais tarde.");
    }
};
exports.createAdmin = createAdmin;
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    const admin = await adminModel_1.default.findOne({ email: email });
    if (!admin) {
        res.status(404).json({ error: "Email ou senha inválidos." });
        return;
    }
    if (!email || !password) {
        res.status(400).json({ error: "Algum dos campos está faltando... Verifique e tente novamente." });
        return;
    }
    try {
        const senhaValida = await bcrypt_1.default.compare(password, admin.password);
        if (!senhaValida) {
            res.status(401).json({ error: "Email ou senha inválidos" });
            return;
        }
        const token = jsonwebtoken_1.default.sign(admin._id, process.env.JWT_KEY, {
            expiresIn: '1d'
        });
        res.status(200).json({ token, success: `Bem vindo ${admin.nome}!` });
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Ocorreu algum erro não esperado. Tente mais tarde.");
    }
};
exports.loginAdmin = loginAdmin;
const getAllAdmins = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    try {
        const admins = await adminModel_1.default.find().skip(skip).limit(limit).sort({ createdAt: -1 });
        const totalCadastros = await adminModel_1.default.countDocuments();
        if (!admins) {
            res.status(404).json({ error: "Não há contatos ou não consegui achar" });
            return;
        }
        res.status(200).json({
            admins,
            totalPages: Math.ceil(totalCadastros / limit),
            currentPage: page,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Ocorreu algum erro com o servidor");
    }
};
exports.getAllAdmins = getAllAdmins;
