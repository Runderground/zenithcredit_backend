"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminControllers_1 = require("../controllers/adminControllers");
const router = express_1.default.Router();
// Rotas públicas
router.post("/login", adminControllers_1.loginAdmin);
// Rotas privadas
router.post("/register", adminControllers_1.createAdmin);
router.get("/", adminControllers_1.getAllAdmins);
exports.default = router;
