const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  const { nom, email, motDePasse, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Un compte avec cet email existe déjà.' });
    }

    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    const user = new User({ nom, email, motDePasse: hashedPassword, role });
    await user.save();

    return res.status(201).json({ message: 'Compte créé avec succès.' });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};
const getUsersCount = async (req,res) => {
  try {
    const count = await User.countDocuments();
    return res.status(200).json({
      success : true,
      count : count
    })
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
}
const login = async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, nom: user.nom },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

module.exports = { register, login , getUsersCount};
