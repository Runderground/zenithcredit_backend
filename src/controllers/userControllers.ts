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