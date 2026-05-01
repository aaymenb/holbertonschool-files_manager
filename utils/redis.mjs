import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();

    // Gestion des erreurs
    this.client.on('error', (err) => {
      console.error('Redis client error:', err.message || err.toString());
    });

    // Promisification des méthodes pour utiliser async/await
    // Indispensable car la version installée semble être la v3
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  /**
   * Vérifie si la connexion à Redis est active.
   * En v3, on vérifie la propriété connected.
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Récupère la valeur d'une clé.
   */
  async get(key) {
    return this.getAsync(key);
  }

  /**
   * Stocke une valeur avec une expiration en secondes.
   */
  async set(key, value, duration) {
    await this.setAsync(key, value, 'EX', duration);
  }

  /**
   * Supprime une clé de Redis.
   */
  async del(key) {
    await this.delAsync(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
