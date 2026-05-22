const express = require('express');
const app = express();
app.get('/', (req, res) => res.json({ message: 'borrow-service en cours de développement' }));
app.listen(3003, () => console.log('borrow-service sur port 3003'));
