import {Request, Response} from 'express'
import cadastroModel from '../models/cadastroModel'
import { deleteImageFromS3 } from '../config/multer'

interface Documento {
  identidade: {url: string, key: string},
  comprovante_renda: {url: string, key: string},
  residencia: {url: string, key: string},
}

interface Usuario {
  documentos: Documento[],
}

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

export const getAllCadastros = async (req: Request,res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1
  const limit = parseInt(req.query.limit as string, 10) || 10

  const skip = (page - 1) * limit
      try {
        const cadastros = await cadastroModel.find().skip(skip).limit(limit).sort({createdAt: -1})

        const totalCadastros = await cadastroModel.countDocuments()
        if(!cadastros) {
          res.status(404).json({error: "Não há contatos ou não consegui achar"})
          return
        }
        res.status(200).json({
          cadastros,
          totalPages: Math.ceil(totalCadastros / limit),
          currentPage: page,
        })
      } catch(error) {
        console.error(error)
        res.status(500).json("Ocorreu algum erro com o servidor")
      }
}

export const FazerCadastro = async (req: Request<IRegisterParams>, res: Response) => {
  const { values } = req.body
  if(!values) {
    res.status(400).json({error: 'Está faltando alguns dos campos. Verifique e tente novamente.'})
    return
  }

  if(!req.file) {
    res.status(400).json({error: 'Não foi possível fazer o cadastro. Verifique se o arquivo foi enviado corretamente.'})
    return
  }

  const invalid_email = await cadastroModel.findOne({email: values.email})
  if(invalid_email) {
    res.status(400).json({error: 'Este email já está registrado, tente outro.'})
    return
  }
  const invalid_cpf = await cadastroModel.findOne({cpf: values.cpf})
  if(invalid_cpf) {
    res.status(400).json({error: 'Este CPF já está registrado, tente outro.'})
    return
  }
  const invalid_telefone = await cadastroModel.findOne({telefone: values.telefone})
  if(invalid_telefone) {
    res.status(400).json({error: 'Este telefone já está registrado, tente outro.'})
    return
  }

  try {
    const cadastro = new cadastroModel({
      nome: values.nome,
      email: values.email,
      telefone: values.telefone,
      cpf: values.cpf,
      cep: values.cep,
      nascimento: values.nascimento,
      renda: values.renda,
      ocupacao: values.ocupacao,
      garantia: values.garantia,
      motivo: values.motivo,
      documentos: [
        
      ]
    })
    await cadastro.save()
    res.status(201).json({success: "Seus documentos foram enviados com sucesso, nossos consultores entrarão em conta o mais breve possível."})
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
    res.status(404).json({error: "Usuário não encontrado ou existente."})
    return
  }
  const user = await cadastroModel.findById(id)
  if(!user) {
    res.status(404).json({error: "Usuário não encontrado ou existente."})
    return
  }
  try {
    const deletarIdentidade = await deleteImageFromS3(user?.documentos[0].identidade[0].key)
    console.log(deletarIdentidade)
    
    const deletarRenda = await deleteImageFromS3(user?.documentos[0].comprovante_renda[0].key)
    console.log(deletarRenda)
    
    const deletarResidencia = await deleteImageFromS3(user?.documentos[0].residencia[0].key)
    console.log(deletarResidencia)
    
    await cadastroModel.findByIdAndDelete(id)
    
    res.status(200).json({success: "Usuário deletado com sucesso."})
  } catch (err) {
    res.status(500).json("Ocorreu algum erro com o servidor")
    console.error(err)
  }
}


export const CountUsers = async (req: Request, res: Response) => {
  const usersCount = await cadastroModel.countDocuments()
  res.json(usersCount)
}