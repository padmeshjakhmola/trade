import pkg from 'pg';
import { extractUserFromToken } from './middleware/auth.js';

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

async function initializeTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stocks (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        total_value DECIMAL(10,2) NOT NULL,
        timestamp TIMESTAMP NOT NULL,
        user_email VARCHAR(255) NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        user_id INTEGER REFERENCES users(id)
      )
    `);
    console.log('✅ Stocks table initialized');
  } catch (error) {
    console.error('Error initializing stocks table:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await initializeTables();

  const user = extractUserFromToken(req.headers.authorization);

  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT * FROM stocks WHERE user_id = $1 ORDER BY timestamp DESC',
        [user.userId]
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      res.status(500).json({ error: 'Failed to fetch stocks' });
    }
  } else if (req.method === 'POST') {
    const { id, name, quantity, price, total_value, timestamp } = req.body;

    try {
      const userResult = await pool.query('SELECT name, email, portfolio_limit FROM users WHERE id = $1', [user.userId]);

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userData = userResult.rows[0];

      const portfolioResult = await pool.query(
        'SELECT COALESCE(SUM(total_value), 0) as current_total FROM stocks WHERE user_id = $1',
        [user.userId]
      );

      const currentPortfolioValue = parseFloat(portfolioResult.rows[0].current_total || 0);
      const newTotal = currentPortfolioValue + parseFloat(total_value);
      const portfolioLimit = parseFloat(userData.portfolio_limit);

      if (newTotal > portfolioLimit) {
        return res.status(400).json({
          error: `Portfolio limit exceeded. Current: ₹${currentPortfolioValue.toLocaleString('en-IN')}, Limit: ₹${portfolioLimit.toLocaleString('en-IN')}, Trying to add: ₹${parseFloat(total_value).toLocaleString('en-IN')}`
        });
      }

      await pool.query(
        `INSERT INTO stocks (id, name, quantity, price, total_value, timestamp, user_email, user_name, user_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [id, name, quantity, price, total_value, timestamp || new Date(), userData.email, userData.name, user.userId]
      );

      res.status(201).json({
        message: 'Stock added successfully',
        portfolioValue: newTotal,
        remainingLimit: portfolioLimit - newTotal
      });
    } catch (error) {
      console.error('Error adding stock:', error);
      res.status(500).json({ error: 'Failed to add stock' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}