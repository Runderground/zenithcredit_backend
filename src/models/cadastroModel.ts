import mongoose from 'mongoose';
interface ICadastro {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  nascimento: string;
  cep: string;
  renda: string;
  ocupacao: string;
  motivo: string;
  garantia: string;
  documentos: string[]
  residencia: string;
  comprovante_renda: string;
  identidade: string;
  createdAt: Date;
}
const CadastroSchema = new mongoose.Schema<ICadastro>({
  nome: { type: String, required: true, maxlength: 50 },
  email: { type: String, required: true, maxlength: 100 },
  telefone: { type: String, required: true, maxlength: 15 },
  cpf: { type: String, required: true, maxlength: 14 },
  nascimento: { type: String, required: true, maxlength: 10 },
  cep: { type: String, required: true , maxlength: 9},
  renda: { type: String, required: true },
  ocupacao: { type: String, required: true },
  motivo: { type: String, required: true },
  garantia: { type: String, required: true },
  documentos: [
    {
      residencia: [
        {
          url: {type: String, required: true},
          key: {type: String, required: true}
        }
      ],
      identidade: [
        {
          url: {type: String, required: true},
          key: {type: String, required: true}
        }
      ],
      comprovante_renda: [
        {
          url: {type: String, required: true},
          key: {type: String, required: true}
        }
      ],
    }
  ],
  createdAt: {type: Date, default: Date.now }
});
const cadastroModel = mongoose.model<ICadastro>('Cadastro', CadastroSchema);

export default cadastroModel