import pg from 'pg';
import logger from './logger.js';

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.PGHOST ?? 'postgres',
  port: Number(process.env.PGPORT ?? 5432),
  database: process.env.PGDATABASE ?? 'lab',
  user: process.env.PGUSER ?? 'lab',
  password: process.env.PGPASSWORD ?? 'lab',
});

// Seed the database with tables and sample data on first connection.
export async function initDb(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS authors (
        id   SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS books (
        id        SERIAL PRIMARY KEY,
        title     TEXT NOT NULL,
        author_id INTEGER REFERENCES authors(id)
      );

      INSERT INTO authors (name)
        SELECT name FROM (VALUES
          ('Kate Chopin'),
          ('Paul Auster'),
          ('Gabriel García Márquez'),
          ('Toni Morrison')
        ) AS v(name)
        WHERE NOT EXISTS (SELECT 1 FROM authors LIMIT 1);

      INSERT INTO books (title, author_id)
        SELECT title, author_id FROM (VALUES
          ('The Awakening',           1),
          ('City of Glass',           2),
          ('One Hundred Years of Solitude', 3),
          ('Beloved',                 4),
          ('The New York Trilogy',    2)
        ) AS v(title, author_id)
        WHERE NOT EXISTS (SELECT 1 FROM books LIMIT 1);
    `);
    logger.info('Database initialised');
  } finally {
    client.release();
  }
}
