import {Request, Response} from 'express'
import cadastroModel from '../models/cadastroModel'

interface IRegisterParams {
  nome: string,
  email: string,
  telefone: string,
  cpf: string,
  nascimento: string,
  renda: string,
  ocupacao: string,
  motivo: string,
  garantia: string,
  cep: string,
}

export const FazerCadastro = async (req: Request<IRegisterParams>, res: Response) => {
  const { nome, email, telefone, cpf, cep, nascimento, renda, ocupacao, motivo, garantia } = req.body
  if(!nome || !email || !telefone || !cpf || !cep || !nascimento || !renda || !ocupacao || !motivo || !garantia) {
    res.status(400).json({error: 'Está faltando alguns dos campos. Verifique e tente novamente.'})
    return
  }

  const invalid_email = await cadastroModel.findOne({email: email})
  if(invalid_email) {
    res.status(400).json({error: 'Este email já está registrado, tente outro.'})
    return
  }
  const invalid_cpf = await cadastroModel.findOne({cpf: cpf})
  if(invalid_cpf) {
    res.status(400).json({error: 'Este CPF já está registrado, tente outro.'})
    return
  }
  const invalid_telefone = await cadastroModel.findOne({telefone: telefone})
  if(invalid_telefone) {
    res.status(400).json({error: 'Este telefone já está registrado, tente outro.'})
    return
  }

  try {
    const cadastro = new cadastroModel({
      nome: nome,
      email: email,
      telefone: telefone,
      cpf: cpf,
      cep: cep,
      nascimento: nascimento,
      renda: renda,
      ocupacao: ocupacao,
      garantia: garantia,
      motivo: motivo
    })
    await cadastro.save()
    res.status(201).json({success: "Seu cadastro foi feito com sucesso."})
  } catch (err) {
    res.status(500).json("Ocorreu algum erro com o servidor")
    console.error(err)
  }
}

export const ConsultarPorQueryUnique = async (req: Request, res: Response) => {
  const { id, email, cpf, telefone } = req.query
  if(id) {
     const User = await cadastroModel.findOne({_id: id})
     if(!User) {
       res.status(404).json({error: "Usuário não encontrado ou existente."})
       return
     }
     res.json(User)
  }
  if(email) {
     const User = await cadastroModel.findOne({email: email})
     if(!User) {
       res.status(404).json({error: "Usuário não encontrado ou existente."})
       return
     }
     res.json(User)
  }
  if(cpf) {
     const User = await cadastroModel.findOne({cpf: cpf})
     if(!User) {
       res.status(404).json({error: "Usuário não encontrado ou existente."})
       return
     }
     res.json(User)
  }
  if(telefone) {
     const User = await cadastroModel.findOne({telefone: telefone})
     if(!User) {
       res.status(404).json({error: "Usuário não encontrado ou existente."})
       return
     }
     res.json(User)
  }
}

export const DeleteUser = async (req: Request, res: Response) => {
  const { id } = req.params
  if(!id) {
    res.status(400).json({error: "Usuário não encontrado ou existente."})
    return
  }
  try {
    await cadastroModel.findByIdAndDelete(id)
    res.status(200).json({success: "Usuário deletado com sucesso."})
  } catch (err) {
    res.status(500).json("Ocorreu algum erro com o servidor")
    console.error(err)
  }
}

