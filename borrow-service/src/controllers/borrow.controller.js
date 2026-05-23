const axios = require('axios');
const Borrow = require('../models/Borrow');
const { publishMessage } = require('../rabbitmq/publisher');

const BOOK_SERVICE_URL = process.env.BOOK_SERVICE_URL || 'http://book-service:3002';
const QUEUE = 'emprunt_effectue';

// POST /borrows — Emprunter un livre
const borrowBook = async (req, res) => {
  const { livreId } = req.body;

  if (!livreId) {
    return res.status(400).json({ message: 'Le champ livreId est requis.' });
  }

  try {
    const bookResponse = await axios.get(`${BOOK_SERVICE_URL}/books/${livreId}`);
    const book = bookResponse.data;

    if (book.disponible === false) {
      return res.status(400).json({ message: 'Livre non disponible' });
    }

    const borrow = new Borrow({
      etudiantId: req.user.id,
      etudiantNom: req.user.nom,
      livreId,
      titreLivre: book.titre,
      statut: 'en_cours',
    });

    await borrow.save();

    await publishMessage(QUEUE, { livreId, action: 'emprunter' });

    return res.status(201).json(borrow);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ message: 'Livre introuvable dans le catalogue.' });
    }
    return res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// PUT /borrows/:id/return — Retourner un livre
const returnBook = async (req, res) => {
  try {
    const borrow = await Borrow.findOne({ _id: req.params.id, etudiantId: req.user.id });

    if (!borrow) {
      return res.status(404).json({ message: 'Emprunt introuvable.' });
    }

    if (borrow.statut === 'retourne') {
      return res.status(400).json({ message: 'Déjà retourné' });
    }

    borrow.statut = 'retourne';
    borrow.dateRetour = new Date();
    await borrow.save();

    await publishMessage(QUEUE, { livreId: borrow.livreId, action: 'retourner' });

    return res.status(200).json(borrow);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// GET /borrows/my — Emprunts de l'étudiant connecté
const getMyBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({ etudiantId: req.user.id }).sort({ dateEmprunt: -1 });
    return res.status(200).json(borrows);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// GET /borrows — Tous les emprunts (tous étudiants)
const getActiveBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find().sort({ dateEmprunt: -1 });
    return res.status(200).json(borrows);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

module.exports = { borrowBook, returnBook, getMyBorrows, getActiveBorrows };
