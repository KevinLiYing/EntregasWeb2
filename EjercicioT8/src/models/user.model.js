/*
{
  name: String,            // Requerido, mín 2 chars
  email: String,           // Requerido, único, formato email
  password: String,        // Requerido, mín 8 chars (guardar hasheado)
  role: String,            // Enum: ['user', 'admin'], default: 'user'
  createdAt: Date          // timestamps: true
}
*/