require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connecté à MongoDB (auth-db)');
    app.listen(PORT, () => {
      console.log(`auth-service démarré sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB :', err.message);
    process.exit(1);
  });
