import mongoose from 'mongoose';

interface IContact {
  nome: string;
  email: string;
  telefone: string;
  comentario: string;
  status: string;
  createdAt: Date;
}

const ContactSchema = new mongoose.Schema<IContact>({
  nome: { type: String, required: true, maxlength: 50 },
  email: { type: String, required: true, maxlength: 100 },
  telefone: { type: String, required: true, maxlength: 15 },
  comentario: {type: String, default: "Não há comentário."},
  status: {type: String, enum: ["Pendente", "Atendido"], default: "Pendente"},
  createdAt: {type: Date, default: Date.now },
});
const contactModel = mongoose.model<IContact>('Contact', ContactSchema);

export default contactModel