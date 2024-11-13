"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cadastroRoutes_1 = __importDefault(require("./routes/cadastroRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 3000;
const DATABASE = process.env.DATABASE;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/cadastros', cadastroRoutes_1.default);
app.use('/api/contatos', contactRoutes_1.default);
app.use('/api/admins', adminRoutes_1.default);
app.get('/helloworld', (req, res) => {
    res.json('Hello World!');
});
app.listen(PORT, () => console.log("Server rodando na porta 3000"));
mongoose_1.default.connect(DATABASE).then(() => console.log("Conectada na Database da Zenith Credit"));
