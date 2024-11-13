import contactModel from '../models/contactModel'
import {Request, Response} from 'express'


export const getAllContacts = async (req: Request,res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1
  const limit = parseInt(req.query.limit as string, 10) || 10

  const skip = (page - 1) * limit
      try {
        const contacts = await contactModel.find().skip(skip).limit(limit)

        const totalContacts = await contactModel.countDocuments()
        if(!contacts) {
          res.status(404).json({error: "Não há contatos ou não consegui achar"})
          return
        }
        res.status(200).json({
          contacts,
          totalPages: Math.ceil(totalContacts / limit),
          currentPage: page,
        })
      } catch(error) {
        console.error(error)
        res.status(500).json("Ocorreu algum erro com o servidor")
      }
}

export const createContact = async (req: Request,res: Response) => {
  
  const {nome, email, telefone, comentario} = req.body

  if(!nome || !email || !telefone) {
    res.status(400).json({error: "Algum dos campos não foi preenchido."})
    return
  }
  const email_invalid = await contactModel.findOne({email: email}) 
  if(email_invalid) {
    res.status(400).json({error: "Este email já está cadastrado."})
    return
  }

  const telefone_invalid = await contactModel.findOne({telefone: telefone}) 
  if(telefone_invalid) {
    res.status(400).json({error: "Este telefone já está cadastrado."})
    return
  }
  
  try {
    const newContact = new contactModel({
      nome: nome,
      email: email,
      telefone: telefone,
      comentario: comentario
    })
    await newContact.save()
    res.status(201).json({success: "Contato enviado com sucesso para nossos atendentes."})
  } catch(error) {
    res.status(500).json("Ocorreu algum erro com o servidor")
    console.error(error)
  }
}

export const deleteContact = async (req: Request,res: Response) => {
  const {id} = req.params
  const user = await contactModel.findOne({_id: id})
  if(!user) {
    res.status(404).json({error: "Usuário não encontrado ou existente."})
    return
  }
  try {
    await contactModel.findByIdAndDelete(id)
    res.status(200).json({success: "Contato deletado com sucesso."})
  } catch(error) {
    res.status(500).json("Ocorreu algum erro com o servidor")
    console.error(error)
  }
}

export const changeStatus = async(req: Request,res: Response) => {
  const { id } = req.params

  const user = await contactModel.findOne({_id: id})
  if(!user) {
    res.status(404).json({error: "Usuário não encontrado ou existente."})
    return
  }

  if (user.status === "Atendido") {
    user.status = "Pendente"
    await user.save()
    res.status(200).json(user)
  } else {
    user.status = "Atendido"
    await user.save()
    res.status(200).json(user)
  }
}