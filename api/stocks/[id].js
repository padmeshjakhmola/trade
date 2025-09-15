import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;

    try {
      await pool.query('DELETE FROM stocks WHERE id = $1', [id]);
      res.json({ message: 'Stock deleted successfully' });
    } catch (error) {
      console.error('Error deleting stock:', error);
      res.status(500).json({ error: 'Failed to delete stock' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}