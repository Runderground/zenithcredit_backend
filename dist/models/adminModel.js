"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AdminSchema = new mongoose_1.default.Schema({
    nome: { type: String, required: true, maxlength: 50 },
    email: { type: String, required: true, maxlength: 100 },
    password: { type: String, required: true, maxlenght: 255 },
    createdAt: { type: Date, default: Date.now },
});
const adminModel = mongoose_1.default.model('Admin', AdminSchema);
exports.default = adminModel;
