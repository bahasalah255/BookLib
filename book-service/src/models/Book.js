const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: true,
    },
    auteur: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
    },
    disponible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
