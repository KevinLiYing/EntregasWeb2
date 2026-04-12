
import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'El nombre de la empresa es requerido']
    },
    cif: {
      type: String,
      required: [true, 'El CIF es requerido']
    },
    address: {
      street: { type: String },
      number: { type: String },
      postal: { type: String },
      city: { type: String },
      province: { type: String }
    },
    logo: {
      type: String,
      default: null
    },
    isFreelance: {
      type: Boolean,
      default: false
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,   // Añade createdAt y updatedAt
    versionKey: false   // Elimina __v
  }
);

const Company = mongoose.model('Company', companySchema);

export default Company;