import express from 'express';
import router from './routes/index.js';

const app = express();
const port = process.env.PORT || 5000;

// Utilisation du middleware pour parser le JSON si nécessaire (optionnel ici)
app.use(express.json());

// Chargement de toutes les routes depuis routes/index.js
app.use('/', router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
