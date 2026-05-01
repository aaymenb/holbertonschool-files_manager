import mongodb from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}`;

    this.client = new mongodb.MongoClient(url, { useUnifiedTopology: true });
    this.dbName = database;
    this.status = false;

    this.client.connect()
      .then(() => {
        this.status = true;
      })
      .catch((err) => {
        console.error(err);
        this.status = false;
      });
  }

  /**
   * Vérifie si la connexion à MongoDB est active.
   */
  isAlive() {
    return !!this.status;
  }

  /**
   * Retourne le nombre de documents dans la collection 'users'.
   */
  async nbUsers() {
    return this.client.db(this.dbName).collection('users').countDocuments();
  }

  /**
   * Retourne le nombre de documents dans la collection 'files'.
   */
  async nbFiles() {
    return this.client.db(this.dbName).collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
