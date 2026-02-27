import mongoose from 'mongoose';
/*{
  title: String,        // Requerido, mín 2 caracteres
  director: String,     // Requerido
  year: Number,         // Entre 1888 y año actual
  genre: String,        // Enum: action, comedy, drama, horror, scifi
  copies: Number,       // Total de copias (default: 5)
  availableCopies: Number, // Copias disponibles
  timesRented: Number,  // Contador de alquileres (default: 0)
  cover: String         // Nombre del archivo de carátula (default: null)
}*/
const movieSchema = new mongoose.Schema(
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
movieSchema.index({ title: 'text' });

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;