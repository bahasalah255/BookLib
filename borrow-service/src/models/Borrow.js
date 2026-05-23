const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema(
  {
    utilisateurId: {
      type: String,
      required: true,
    },
    utilisateurNom: {
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
      enum: ['emprunte', 'retourne'],
      default: 'emprunte',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Borrow', borrowSchema);
