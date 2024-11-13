"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_KEY;
const authenticateJWT = (req, res, next) => {
    const token = req.header('authorization')?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: "Token não fornecido" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        req.user = decoded;
        res.status(200).json({ success: "Token válido" });
        next();
    }
    catch (error) {
        res.status(403).json({ error: "Token inválido ou expirado" });
    }
};
exports.authenticateJWT = authenticateJWT;
