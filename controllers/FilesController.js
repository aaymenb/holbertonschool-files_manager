import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class FilesController {
  // ... (garde postUpload ici)

  /**
   * Récupère un document de fichier spécifique par ID pour l'utilisateur authentifié
   */
  static async getShow(req, res) {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const fileId = req.params.id;
    const file = await dbClient.client.db(dbClient.dbName).collection('files').findOne({
      _id: ObjectId(fileId),
      userId: ObjectId(userId),
    });

    if (!file) return res.status(404).json({ error: 'Not found' });

    return res.status(200).json({
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    });
  }

  /**
   * Liste les fichiers d'un parentId spécifique avec pagination (20 par page)
   */
  static async getIndex(req, res) {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { parentId = 0, page = 0 } = req.query;
    const skip = parseInt(page, 10) * 20;

    // Préparation du filtre parentId (0 ou ObjectId)
    const matchQuery = {
      userId: ObjectId(userId),
      parentId: parentId === '0' || parentId === 0 ? 0 : ObjectId(parentId),
    };

    // Utilisation de aggregate pour la pagination et le formatage
    const files = await dbClient.client.db(dbClient.dbName).collection('files').aggregate([
      { $match: matchQuery },
      { $skip: skip },
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
