require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/book.routes');
const connectConsumer = require('./rabbitmq/consumer');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/books', bookRoutes);

const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connecté à MongoDB (books-db)');
    connectConsumer();
    app.listen(PORT, () => {
      console.log(`book-service démarré sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB :', err.message);
    process.exit(1);
  });
