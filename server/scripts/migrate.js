const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DB_NAME = 'gator_marketplace';
const MIGRATIONS_DIR = path.join(__dirname, '../../db/migrations');

async function createDatabase() {
    // Always connect to 'postgres' database to create new databases
    let connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/postgres';
    // Replace the database name in the URL with 'postgres'
    connectionString = connectionString.replace(/\/[^/]*$/, '/postgres');

    const client = new Client({ connectionString });

    try {
        await client.connect();
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`);
        if (res.rowCount === 0) {
            console.log(`Creating database ${DB_NAME}...`);
            await client.query(`CREATE DATABASE ${DB_NAME}`);
            console.log('Database created.');
        } else {
            console.log(`Database ${DB_NAME} already exists.`);
        }
    } catch (err) {
        console.error('Error creating database:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

async function runMigrations() {
    // Use DATABASE_URL directly since it points to gator_marketplace
    let connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        connectionString = `postgresql://postgres:postgres@127.0.0.1:5432/${DB_NAME}`;
    }

    const client = new Client({ connectionString });

    try {
        await client.connect();
        const files = fs.readdirSync(MIGRATIONS_DIR).sort();

        for (const file of files) {
            if (file.endsWith('.sql')) {
                console.log(`Running migration ${file}...`);
                const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
                await client.query(sql);
                console.log(`Migration ${file} completed.`);
            }
        }
    } catch (err) {
        console.error('Error running migrations:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

async function main() {
    await createDatabase();
    await runMigrations();
}

main();
