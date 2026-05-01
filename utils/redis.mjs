import { createClient } from 'redis';

class RedisClient {
  constructor() {
    // Création du client redis
    this.client = createClient();

    // Gestion des erreurs affichée dans la console
    this.client.on('error', (err) => {
      console.error('Redis Client Error', err);
    });

    // Connexion immédiate
    this.client.connect().catch((err) => {
      // On capture l'erreur de connexion pour éviter de faire crash le process
      // mais on laisse l'event 'error' gérer l'affichage
    });
  }

  /**
   * Vérifie si la connexion est active.
   * Utilise 'isOpen' pour retourner false si le service redis-server est arrêté.
   */
  isAlive() {
    return this.client.isOpen;
  }

  /**
   * Récupère la valeur associée à une clé
   */
  async get(key) {
    return this.client.get(key);
  }

  /**
   * Stocke une valeur avec une durée d'expiration (TTL)
   */
  async set(key, value, duration) {
    await this.client.set(key, value, {
      EX: duration,
    });
  }

  /**
   * Supprime une clé de Redis
   */
  async del(key) {
    await this.client.del(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
