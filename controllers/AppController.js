import redisClient from '../utils/redis.mjs';
import dbClient from '../utils/db.mjs';

class AppController {
  /**
   * Retourne l'état de santé de Redis et de la DB
   */
  static getStatus(req, res) {
    const status = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    res.status(200).json(status);
  }

  /**
   * Retourne les statistiques sur le nombre d'utilisateurs et de fichiers
   */
  static async getStats(req, res) {
    const usersCount = await dbClient.nbUsers();
    const filesCount = await dbClient.nbFiles();
    const stats = {
      users: usersCount,
      files: filesCount,
    };
    res.status(200).json(stats);
  }
}

export default AppController;
