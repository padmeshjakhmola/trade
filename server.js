import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize database table
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
    console.log('Database table initialized');
  } catch (error) {
    console.error('Error initializing database table:', error);
  }
}

// API Routes
app.get('/api/stocks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stocks ORDER BY timestamp DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
});

app.post('/api/stocks', async (req, res) => {
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
});

app.delete('/api/stocks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM stocks WHERE id = $1', [id]);
    res.json({ message: 'Stock deleted successfully' });
  } catch (error) {
    console.error('Error deleting stock:', error);
    res.status(500).json({ error: 'Failed to delete stock' });
  }
});

// Start server and initialize database
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeTable();
});