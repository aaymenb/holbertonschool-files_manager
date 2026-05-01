import { ObjectId } from 'mongodb';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class FilesController {
  // ... garde ton postUpload ici ...

  static async getShow(req, res) {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const fileId = req.params.id;
    // On cherche le fichier par son ID ET le userId du propriétaire
    const file = await dbClient.client.db(dbClient.dbName).collection('files').findOne({
      _id: ObjectId(fileId),
      userId: ObjectId(userId),
    });

    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }

    return res.status(200).json({
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    });
  }

  static async getIndex(req, res) {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { parentId = 0, page = 0 } = req.query;
    const skipPage = parseInt(page, 10) * 20;

    // Construction du filtre de recherche
    const query = { userId: ObjectId(userId) };
    if (parentId !== 0 && parentId !== '0') {
      query.parentId = ObjectId(parentId);
    } else {
      query.parentId = 0;
    }

    const files = await dbClient.client.db(dbClient.dbName).collection('files').aggregate([
      { $match: query },
      { $skip: skipPage },
      { $limit: 20 },
      {
        $project: {
          id: '$_id',
          _id: 0,
          userId: 1,
          name: 1,
          type: 1,
          isPublic: 1,
          parentId: 1,
        },
      },
    ]).toArray();

    return res.status(200).json(files);
  }
}

export default FilesController;
