import mongoose from 'mongoose';
/*{
  email: String,             // Único (index: unique), validado con Zod
  password: String,          // Cifrada con bcrypt
  name: String,              // Nombre
  lastName: String,          // Apellidos
  nif: String,               // Documento de identidad
  role: 'admin' | 'guest',            // Por defecto: 'admin'
  status: 'pending' | 'verified',     // Estado de verificación del email (index)
  verificationCode: String,  // Código aleatorio de 6 dígitos
  verificationAttempts: Number, // Intentos restantes (máximo 3)
  company: ObjectId,         // ref: 'Company' — se asigna en el onboarding (index)
  address: {
    street: String,
    number: String,
    postal: String,
    city: String,
    province: String
  },
  deleted: Boolean,          // Soft delete
  createdAt: Date,
  updatedAt: Date
}*/
// Virtual (no se almacena, se calcula):
// fullName → name + ' ' + lastName
const userSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El nombre es requerido'],
      minlength: [2, 'Mínimo 2 caracteres'],
    },
    director: {
      type: String,
      require: [true, "El director es requerido"]
    },
    year: {
      type: Number,
      min: [1888, "Año introducido no válido"]
    },
    genre: {
      type: String,
      enum: ["action", "comedy" , "drama", "horror", "scifi"],
    required: [true, "Introduce un género"]
    },
    copies: {
      type: Number,
      default: 5,
      min: [0, "No puede ser negativo"]
    },
    availableCopies: {
      type: Number,
      default: 5,
      min: [0, "No puede ser negativo"]
    },
    timesRented: {
      type: Number,
      default: 0,
      min: 0
    },
    cover: {
      type: String,
      default: null
    },
    rating: {
      type: Number,
      min: [0, 'El rating mínimo es 0'],
      max: [5, 'El rating máximo es 5'],
      default: 0
}

  },
  {
    timestamps: true,   // Añade createdAt y updatedAt
    versionKey: false   // Elimina __v
  }
);

// Probando a usar indices
userSchema.index({ title: 'text' });

const User = mongoose.model('User', userSchema);

export default User;