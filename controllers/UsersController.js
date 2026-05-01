import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const users = dbClient.client.db(dbClient.dbName).collection('users');
    const user = await users.findOne({ email });

    if (user) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Ici on utilise 'crypto' -> donc l'erreur 'unused' disparaîtra
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
    const result = await users.insertOne({ email, password: hashedPassword });

    return res.status(201).json({ id: result.insertedId, email });
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await dbClient.client.db(dbClient.dbName).collection('users').findOne({
      _id: ObjectId(userId),
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(200).json({ id: user._id, email: user.email });
  }
}

export default UsersController;
