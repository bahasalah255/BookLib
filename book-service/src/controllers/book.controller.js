const Book = require('../models/Book');

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    return res.status(200).json(books);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

const getAvailableBooks = async (req, res) => {
  try {
    const books = await Book.find({ disponible: true });
    return res.status(200).json(books);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Livre introuvable.' });
    }
    return res.status(200).json(book);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

const createBook = async (req, res) => {
  const { titre, auteur, isbn, disponible } = req.body;
  try {
    const existing = await Book.findOne({ isbn });
    if (existing) {
      return res.status(400).json({ message: 'Un livre avec cet ISBN existe déjà.' });
    }
    const book = new Book({ titre, auteur, isbn, disponible });
    await book.save();
    return res.status(201).json(book);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      return res.status(404).json({ message: 'Livre introuvable.' });
    }
    return res.status(200).json(book);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Livre introuvable.' });
    }
    return res.status(200).json({ message: 'Livre supprimé avec succès.' });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

module.exports = { getAllBooks, getAvailableBooks, getBookById, createBook, updateBook, deleteBook };
