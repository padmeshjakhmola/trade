import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initializeTable() {
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
        user_name VARCHAR(255) NOT NULL
      )
    `);
  } catch (error) {
    console.error('Error initializing database table:', error);
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await initializeTable();

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM stocks ORDER BY timestamp DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      res.status(500).json({ error: 'Failed to fetch stocks' });
    }
  } else if (req.method === 'POST') {
    const { id, name, quantity, price, total_value, timestamp, user_email, user_name } = req.body;

    try {
      await pool.query(
        `INSERT INTO stocks (id, name, quantity, price, total_value, timestamp, user_email, user_name)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [id, name, quantity, price, total_value, timestamp || new Date(), user_email, user_name]
      );
      res.status(201).json({ message: 'Stock added successfully' });
    } catch (error) {
      console.error('Error adding stock:', error);
      res.status(500).json({ error: 'Failed to add stock' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}