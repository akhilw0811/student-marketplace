require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/gator_marketplace',
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
};
