import mongoose from 'mongoose';

interface IAdmin {
  nome: string,
  email: string,
  password: string,
  createdAt: Date,
}

const AdminSchema = new mongoose.Schema<IAdmin>({
  nome: { type: String, required: true, maxlength: 50 },
  email: { type: String, required: true, maxlength: 100 },
  password: { type: String, required: true, maxlenght: 255},
  createdAt: {type: Date, default: Date.now },
});
const adminModel = mongoose.model<IAdmin>('Admin', AdminSchema);

export default adminModel