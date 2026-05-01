static async putPublish(req, res) {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const fileId = req.params.id;
    if (!ObjectId.isValid(fileId)) return res.status(404).json({ error: 'Not found' });

    const collection = dbClient.client.db(dbClient.dbName).collection('files');
    const filter = { _id: ObjectId(fileId), userId: ObjectId(userId) };
    const update = { $set: { isPublic: true } };

    const result = await collection.findOneAndUpdate(filter, update, { returnDocument: 'after' });

    if (!result.value) return res.status(404).json({ error: 'Not found' });

    const file = result.value;
    return res.status(200).json({
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    });
  }

  static async putUnpublish(req, res) {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const fileId = req.params.id;
    if (!ObjectId.isValid(fileId)) return res.status(404).json({ error: 'Not found' });

    const collection = dbClient.client.db(dbClient.dbName).collection('files');
    const filter = { _id: ObjectId(fileId), userId: ObjectId(userId) };
    const update = { $set: { isPublic: false } };

    const result = await collection.findOneAndUpdate(filter, update, { returnDocument: 'after' });

    if (!result.value) return res.status(404).json({ error: 'Not found' });

    const file = result.value;
    return res.status(200).json({
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    });
  }
