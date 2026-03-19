import mongoose from 'mongoose';
/*
{
  name: String,            // Requerido, mín 2 chars
  email: String,           // Requerido, único, formato email
  password: String,        // Requerido, mín 8 chars (guardar hasheado)
  role: String,            // Enum: ['user', 'admin'], default: 'user'
  createdAt: Date          // timestamps: true
}
*/

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,

  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    timestamps: true
  }
});

const User = mongoose.model('User', userSchema);

export default User;