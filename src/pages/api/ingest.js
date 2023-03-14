import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const client = new MongoClient('mongodb+srv://Yanis:YanisMDP@cluster0.ksinxhv.mongodb.net/?retryWrites=true&w=majority');

  if (req.method === 'GET') {
    try {
      await client.connect();

      const db = client.db('log');
      const collection = db.collection('log');

      const data = await collection.find({}).toArray();

      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await client.close();
    }
  } else if (req.method === 'POST') {
    try {
      const db = client.db('log');
      const collection = db.collection('log');

      const data = req.body;

      // Ajoutez les données horaires et le type de données automatiquement
      const now = new Date();
      data.timestamp = now.toISOString();

      await collection.insertOne(data);

      res.status(200).json({ message: 'Data ingested successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await client.close();
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}