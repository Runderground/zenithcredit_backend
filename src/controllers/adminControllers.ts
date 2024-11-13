import adminModel from "../models/adminModel";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const createAdmin = async (req: Request, res: Response) => {
  const { nome, email, password } = req.body;
  if (!nome || !email || !password) {
    res
      .status(400)
      .json({
        error: "Algum dos campos está faltando... Verifique e tente novamente.",
      });
    return;
  }
  const invalid_email = await adminModel.findOne({ email: email });
  if (invalid_email) {
    res
      .status(400)
      .json({
        error:
          "Já existe um administrador com este email. Tente utilizar outro.",
      });
    return;
  }
  try {
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const admin = await adminModel.create({
      nome: nome,
      email: email,
      password: hashedPassword,
    });
    const newAdmin = await admin.save();

    const token = jwt.sign(
      { _id: newAdmin._id },
      process.env.JWT_KEY as string
    );

    res.json({ token, success: "Administrador criado com sucesso!", newAdmin});
  } catch (error) {
    console.error(error);
    res.status(500).json("Ocorreu algum erro não esperado. Tente mais tarde.");
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const admin = await adminModel.findOne({ email: email });
  if (!admin) {
    res.status(404).json({ error: "Email ou senha inválidos." });
    return;
  }

  if (!email || !password) {
    res
      .status(400)
      .json({
        error: "Algum dos campos está faltando... Verifique e tente novamente.",
      });
    return;
  }
  try {
    const senhaValida = await bcrypt.compare(password, admin.password);

    if (!senhaValida) {
      res.status(401).json({ error: "Email ou senha inválidos" });
      return;
    }

    const token = jwt.sign({ _id: admin._id }, process.env.JWT_KEY as string);

    res.status(200).json({ token, success: `Bem vindo ${admin.nome}!`, admin });
  } catch (error) {
    console.error(error);
    res.status(500).json("Ocorreu algum erro não esperado. Tente mais tarde.");
  }
};

export const getAllAdmins = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const skip = (page - 1) * limit;
  try {
    const admins = await adminModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalCadastros = await adminModel.countDocuments();
    if (!admins) {
      res.status(404).json({ error: "Não há contatos ou não consegui achar" });
      return;
    }
    res.status(200).json({
      admins,
      totalPages: Math.ceil(totalCadastros / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Ocorreu algum erro com o servidor");
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (id === "6734df7dc785c81f5b03992e") {
      res
        .status(401)
        .json({ error: "SuperAdministrador não pode ser deletado." });
      return;
    }
    const admin = await adminModel.findByIdAndDelete(id);
    if (!admin) {
      res
        .status(404)
        .json({ error: "Administrador não encontrado ou existente." });
      return;
    }
    res.status(200).json({ success: "Administrador deletado com sucesso." });
  } catch (error) {
    console.error(error);
  }
};

export const tokenVerified = (req: Request, res: Response) => {
  res.status(200).json({error:"Token Verificado"})
}
