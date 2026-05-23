const axios = require('axios');
const Borrow = require('../models/Borrow');
const { publishMessage } = require('../rabbitmq/publisher');

const BOOK_SERVICE_URL = process.env.BOOK_SERVICE_URL || 'http://book-service:3002';

// POST /borrows — Emprunter un livre
const borrowBook = async (req, res) => {
  const { livreId } = req.body;

  if (!livreId) {
    return res.status(400).json({ message: 'Le champ livreId est requis.' });
  }

  try {
    // Vérifier la disponibilité du livre via le book-service
    const bookResponse = await axios.get(`${BOOK_SERVICE_URL}/books/${livreId}`);
    const book = bookResponse.data;

    if (!book.disponible) {
      return res.status(400).json({ message: 'Ce livre n\'est pas disponible actuellement.' });
    }

    // Vérifier si l'utilisateur a déjà emprunté ce livre (emprunt actif)
    const existingBorrow = await Borrow.findOne({
      utilisateurId: req.user.id,
      livreId,
      statut: 'emprunte',
    });

    if (existingBorrow) {
      return res.status(400).json({ message: 'Vous avez déjà emprunté ce livre.' });
    }

    // Créer l'emprunt
    const borrow = new Borrow({
      utilisateurId: req.user.id,
      utilisateurNom: req.user.nom,
      livreId,
      titreLivre: book.titre,
      statut: 'emprunte',
    });

    await borrow.save();

    // Publier un message RabbitMQ pour notifier le book-service
    publishMessage(livreId, 'emprunter');

    return res.status(201).json({
      message: 'Livre emprunté avec succès.',
      emprunt: borrow,
    });
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
    const borrow = await Borrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({ message: 'Emprunt introuvable.' });
    }

    // Vérifier que l'emprunt appartient à l'utilisateur connecté
    if (borrow.utilisateurId !== req.user.id) {
      return res.status(403).json({ message: 'Vous ne pouvez retourner que vos propres emprunts.' });
    }

    if (borrow.statut === 'retourne') {
      return res.status(400).json({ message: 'Ce livre a déjà été retourné.' });
    }

    // Mettre à jour l'emprunt
    borrow.statut = 'retourne';
    borrow.dateRetour = new Date();
    await borrow.save();

    // Publier un message RabbitMQ pour notifier le book-service
    publishMessage(borrow.livreId, 'retourner');

    return res.status(200).json({
      message: 'Livre retourné avec succès.',
      emprunt: borrow,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// GET /borrows — Liste des emprunts en cours de l'utilisateur
const getActiveBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({
      utilisateurId: req.user.id,
      statut: 'emprunte',
    }).sort({ dateEmprunt: -1 });

    return res.status(200).json(borrows);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

module.exports = { borrowBook, returnBook, getActiveBorrows };
