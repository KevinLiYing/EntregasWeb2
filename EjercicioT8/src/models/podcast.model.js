/*
{
  title: String,           // Requerido, mín 3 chars
  description: String,     // Requerido, mín 10 chars
  author: ObjectId,        // Ref a User, requerido
  category: String,        // Enum: ['tech', 'science', 'history', 'comedy', 'news']
  duration: Number,        // Duración en segundos, mín 60
  episodes: Number,        // Número de episodios, default: 1
  published: Boolean,      // Si está publicado, default: false
  createdAt: Date          // timestamps: true
}
*/