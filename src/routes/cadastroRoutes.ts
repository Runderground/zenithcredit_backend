import express, { Express } from 'express'
import { ConsultarPorQueryUnique, DeleteUser, getAllCadastros, CountUsers } from '../controllers/cadastroControllers'
import { authenticateJWT } from '../middleware/Auth'
import upload from '../config/multer'
import cadastroModel from '../models/cadastroModel'

const router = express.Router()

// Rotas públicas
router.post('/register', upload.fields([
  {name: "residencia", maxCount: 1},
  {name: "renda", maxCount: 1},
  {name: "identidade", maxCount: 1},
]), async(req,res) => {
  const { values } = req.body
  const { renda, residencia, identidade} = req.files as {
    residencia: Express.MulterS3.File[],
    renda: Express.MulterS3.File[]
    identidade: Express.MulterS3.File[]
  }
  if(!values) {
    res.status(400).json({error: 'Está faltando alguns dos campos. Verifique e tente novamente.'})
    return
  }

  const dados = JSON.parse(values)

  if(!req.files) {
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
    })
    await cadastro.save()
    res.status(201).json({success: "Seus documentos foram enviados com sucesso, nossos consultores entrarão em conta o mais breve possível."})
  } catch (err) {
    res.status(500).json("Ocorreu algum erro com o servidor")
    console.error(err)
  }
})

//Rotas privadas

router.get('/find_user_unique', authenticateJWT, ConsultarPorQueryUnique)
router.delete('/delete/:id', authenticateJWT, DeleteUser)
router.get('/', authenticateJWT, getAllCadastros)
router.get("/totalusers", authenticateJWT, CountUsers)

export default router