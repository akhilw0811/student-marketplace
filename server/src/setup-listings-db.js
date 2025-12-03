require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function setupListingsTable() {
    try {
        console.log('Connecting to DB...');
        await pool.connect();
        console.log('Connected.');

        console.log('Creating listings table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS listings (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                category VARCHAR(100) NOT NULL,
                image_url TEXT,
                seller_id INTEGER REFERENCES users(id),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Listings table created.');

        await pool.end();
    } catch (err) {
        console.error('Error:', err);
    }
}

setupListingsTable();
