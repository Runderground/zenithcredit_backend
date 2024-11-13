import adminModel from '../models/adminModel'
import {Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const createAdmin = async (req: Request, res: Response) => {
    const { nome, email, password } = req.body
  if(!nome || !email || !password) {
    res.status(400).json({error: "Algum dos campos está faltando... Verifique e tente novamente."})
    return
  }
  const invalid_email = await adminModel.findOne({email: email}) 
  if(invalid_email) {
    res.status(400).json({error: "Já existe um administrador com este email. Tente utilizar outro."})
  return
  }
  try {
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const admin = await adminModel.create({
      nome: nome,
      email: email,
      password: hashedPassword
    })
    const newAdmin = await admin.save()

    const token = jwt.sign(newAdmin._id, process.env.JWT_KEY as string, {
      expiresIn: '1d'
    })
    
    res.json(201).json({token, success: "Administrador criado com sucesso!"})
  }catch(error) {
    console.error(error)
    res.status(500).json("Ocorreu algum erro não esperado. Tente mais tarde.")
  }
}