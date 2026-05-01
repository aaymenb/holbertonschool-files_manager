import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    // Récupération des variables d'environnement ou valeurs par défaut
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'files_manager';
    
    const url = `mongodb://${host}:${port}`;
    
    // Initialisation du client MongoDB
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.dbName = database;
    this.connected = false;

    // Tentative de connexion
    this.client.connect()
      .then(() => {
        this.connected = true;
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        this.connected = false;
      });
  }

  /**
   * Vérifie si la connexion à MongoDB est établie
   * @returns {boolean}
   */
  isAlive() {
    return this.connected;
  }

  /**
   * Compte le nombre de documents dans la collection 'users'
   * @returns {Promise<number>}
   */
  async nbUsers() {
    const db = this.client.db(this.dbName);
    return db.collection('users').countDocuments();
  }

  /**
   * Compte le nombre de documents dans la collection 'files'
   * @returns {Promise<number>}
   */
  async nbFiles() {
    const db = this.client.db(this.dbName);
    return db.collection('files').countDocuments();
  }
}

// Création et export d'une instance unique
const dbClient = new DBClient();
export default dbClient;
