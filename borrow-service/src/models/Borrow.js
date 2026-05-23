const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema(
  {
    etudiantId: {
      type: String,
      required: true,
    },
    etudiantNom: {
      type: String,
      required: true,
    },
    livreId: {
      type: String,
      required: true,
    },
    titreLivre: {
      type: String,
      required: true,
    },
    dateEmprunt: {
      type: Date,
      default: Date.now,
    },
    dateRetour: {
      type: Date,
      default: null,
    },
    statut: {
      type: String,
      enum: ['en_cours', 'retourne'],
      default: 'en_cours',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Borrow', borrowSchema);
