const express = require('express');
const app = express();
app.get('/', (req, res) => res.json({ message: 'book-service en cours de développement' }));
app.listen(3002, () => console.log('book-service sur port 3002'));
