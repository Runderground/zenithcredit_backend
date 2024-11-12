import express, {Request, Response} from 'express'
import cadastroModel from '../models/cadastroModel'

const router = express.Router()
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


router.get('/', (req,res) => {
  res.json('All users')
})

router.post('/register', async (req: Request<IRegisterParams>,res) => {
  const { nome, email, telefone, cpf, cep, nascimento, renda, ocupacao, motivo, garantia } = req.params
  if(!nome || !email || !telefone || !cpf || !cep || !nascimento || !renda || !ocupacao || !motivo || !garantia) {
    res.status(400).json({error: 'Está faltando alguns dos campos. Verifique e tente novamente.'})
    return
  }

  const invalid_email = cadastroModel.find
  
})

export default router