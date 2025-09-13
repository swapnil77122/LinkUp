// backend/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
  database: process.env.PGDATABASE || 'messaging_app',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
