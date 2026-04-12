import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    password: {
      type: String,
      required: [true, 'La contraseña es requerida']
    },
    name: {
      type: String,
      required: [true, 'El nombre es requerido']
    },
    lastName: {
      type: String,
      required: [true, 'Los apellidos son requeridos']
    },
    nif: {
      type: String,
      required: [true, 'El NIF es requerido']
    },
    role: {
      type: String,
      enum: ['admin', 'guest'],
      default: 'admin'
    },
    status: {
      type: String,
      enum: ['pending', 'verified'],
      default: 'pending',
      index: true
    },
    verificationCode: {
      type: String
    },
    verificationAttempts: {
      type: Number,
      default: 3
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      index: true
    },
    address: {
      street: { type: String },
      number: { type: String },
      postal: { type: String },
      city: { type: String },
      province: { type: String }
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

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.name} ${this.lastName}`;
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ company: 1 });
userSchema.index({ status: 1 });

const User = mongoose.model('User', userSchema);

export default User;