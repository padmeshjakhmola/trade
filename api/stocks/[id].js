import pkg from 'pg';
import { extractUserFromToken } from '../middleware/auth.js';

const { Pool } = pkg;

const pool = new Pool({
  host: 'ep-square-bird-a12kgp85-pooler.ap-southeast-1.aws.neon.tech',
  port: 5432,
  database: 'neondb',
  user: 'neondb_owner',
  password: 'npg_cT15JMXjgaKe',
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const user = extractUserFromToken(req.headers.authorization);

  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.method === 'DELETE') {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    if (!id) {
      return res.status(400).json({ error: 'Stock ID is required' });
    }

    try {
      const result = await pool.query('DELETE FROM stocks WHERE id = $1 AND user_id = $2 RETURNING *', [id, user.userId]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Stock not found or not authorized' });
      }

      res.json({
        message: 'Stock deleted successfully',
        deletedStock: result.rows[0]
      });
    } catch (error) {
      console.error('Error deleting stock:', error);
      res.status(500).json({ error: 'Failed to delete stock' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}