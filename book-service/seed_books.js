require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./src/models/Book');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/books-db';

const books = [
  { titre: 'Clean Code', auteur: 'Robert C. Martin', isbn: '9780132350884', disponible: true, quantite: 3 },
  { titre: 'The Pragmatic Programmer', auteur: 'Andrew Hunt', isbn: '9780201616224', disponible: true, quantite: 2 },
];

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to Mongo, seeding books...');
    await Book.deleteMany({});
    const created = await Book.insertMany(books);
    console.log('Seeded books:', created);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seed error', err);
    process.exit(1);
  });
