require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const borrowRoutes = require('./routes/borrow.routes');
const { connectPublisher } = require('./rabbitmq/publisher');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/borrows', borrowRoutes);

const PORT = process.env.PORT || 3003;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connecté à MongoDB (borrow-db)');
    connectPublisher();
    app.listen(PORT, () => {
      console.log(`borrow-service démarré sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB :', err.message);
    process.exit(1);
  });
