import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const router = express.Router();

// Route pour vérifier l'état des services (Redis et DB)
router.get('/status', AppController.getStatus);

// Route pour obtenir les statistiques (nb de users et de files)
router.get('/stats', AppController.getStats);

// Route pour créer un nouvel utilisateur
router.post('/users', UsersController.postNew);

export default router;
