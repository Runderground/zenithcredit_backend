"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ContactSchema = new mongoose_1.default.Schema({
    nome: { type: String, required: true, maxlength: 50 },
    email: { type: String, required: true, maxlength: 100 },
    telefone: { type: String, required: true, maxlength: 15 },
    comentario: { type: String, default: "Não há comentário." },
    status: { type: String, enum: ["Pendente", "Atendido"], default: "Pendente" },
    createdAt: { type: Date, default: Date.now },
});
const contactModel = mongoose_1.default.model('Contact', ContactSchema);
exports.default = contactModel;
