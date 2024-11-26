"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cadastroControllers_1 = require("../controllers/cadastroControllers");
const Auth_1 = require("../middleware/Auth");
const multer_1 = __importDefault(require("../config/multer"));
const cadastroModel_1 = __importDefault(require("../models/cadastroModel"));
const router = express_1.default.Router();
// Rotas públicas
router.post('/register', multer_1.default.fields([
    { name: "residencia", maxCount: 1 },
    { name: "renda", maxCount: 1 },
    { name: "identidade", maxCount: 1 },
]), async (req, res) => {
    const { values } = req.body;
    const { renda, residencia, identidade } = req.files;
    if (!values) {
        res.status(400).json({ error: 'Está faltando alguns dos campos. Verifique e tente novamente.' });
        return;
    }
    const dados = JSON.parse(values);
    if (!req.files) {
        res.status(400).json({ error: 'Não foi possível fazer o cadastro. Verifique se o arquivo foi enviado corretamente.' });
        return;
    }
    const invalid_email = await cadastroModel_1.default.findOne({ email: values.email });
    if (invalid_email) {
        res.status(400).json({ error: 'Este email já está registrado, tente outro.' });
        return;
    }
    const invalid_cpf = await cadastroModel_1.default.findOne({ cpf: values.cpf });
    if (invalid_cpf) {
        res.status(400).json({ error: 'Este CPF já está registrado, tente outro.' });
        return;
    }
    const invalid_telefone = await cadastroModel_1.default.findOne({ telefone: values.telefone });
    if (invalid_telefone) {
        res.status(400).json({ error: 'Este telefone já está registrado, tente outro.' });
        return;
    }
    try {
        const cadastro = new cadastroModel_1.default({
            nome: dados.nome,
            email: dados.email,
            telefone: dados.telefone,
            cpf: dados.cpf,
            cep: dados.cep,
            nascimento: dados.nascimento,
            renda: dados.renda,
            ocupacao: dados.ocupacao,
            garantia: dados.garantia,
            motivo: dados.motivo,
            documentos: [
                {
                    identidade: [
                        {
                            url: identidade[0].location,
                            key: identidade[0].key
                        }
                    ],
                    residencia: [
                        {
                            url: residencia[0].location,
                            key: residencia[0].key
                        }
                    ],
                    comprovante_renda: [
                        {
                            url: renda[0].location,
                            key: renda[0].key
                        }
                    ]
                }
            ]
        });
        await cadastro.save();
        res.status(201).json({ success: "Seus documentos foram enviados com sucesso, nossos consultores entrarão em conta o mais breve possível." });
    }
    catch (err) {
        res.status(500).json("Ocorreu algum erro com o servidor");
        console.error(err);
    }
});
//Rotas privadas
router.get('/find_user_unique', Auth_1.authenticateJWT, cadastroControllers_1.ConsultarPorQueryUnique);
router.delete('/delete/:id', Auth_1.authenticateJWT, cadastroControllers_1.DeleteUser);
router.get('/', Auth_1.authenticateJWT, cadastroControllers_1.getAllCadastros);
router.get("/totalusers", Auth_1.authenticateJWT, cadastroControllers_1.CountUsers);
router.put("/update/:id", Auth_1.authenticateJWT, cadastroControllers_1.updateCadastro);
exports.default = router;
