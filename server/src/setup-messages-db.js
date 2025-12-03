require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function setupMessagesTable() {
    try {
        console.log('Connecting to DB...');
        await pool.connect();
        console.log('Connected.');

        console.log('Creating messages table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                from_user_id INTEGER REFERENCES users(id),
                to_user_id INTEGER REFERENCES users(id),
                listing_id INTEGER REFERENCES listings(id),
                content TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Messages table created.');

        await pool.end();
    } catch (err) {
        console.error('Error:', err);
    }
}

setupMessagesTable();
