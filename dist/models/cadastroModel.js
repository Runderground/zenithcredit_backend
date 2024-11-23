"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CadastroSchema = new mongoose_1.default.Schema({
    nome: { type: String, required: true, maxlength: 50 },
    email: { type: String, required: true, maxlength: 100 },
    telefone: { type: String, required: true, maxlength: 15 },
    cpf: { type: String, required: true, maxlength: 14 },
    nascimento: { type: String, required: true, maxlength: 10 },
    cep: { type: String, required: true, maxlength: 9 },
    renda: { type: String, required: true },
    ocupacao: { type: String, required: true },
    motivo: { type: String, required: true },
    garantia: { type: String, required: true },
    documentos: [
        {
            residencia: { type: String, required: true },
            identidade: { type: String, required: true },
            comprovante_renda: { type: String, required: true },
        }
    ],
    createdAt: { type: Date, default: Date.now }
});
const cadastroModel = mongoose_1.default.model('Cadastro', CadastroSchema);
exports.default = cadastroModel;
