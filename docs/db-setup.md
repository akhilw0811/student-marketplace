# Database Setup

## Prerequisites
- **PostgreSQL**: You need to install PostgreSQL.
  - **Download**: [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
  - **Interactive Installer**: Download the installer from EDB (linked above) and run it.
  - **Default Settings**: Keep the default port (`5432`) and remember the password you set (default is often `postgres` or you will be asked to set one).

## Setup Steps

## Setup Steps

1. **Install Dependencies**
   Navigate to the `server` directory and install dependencies:
   ```bash
   cd server
   npm install
   ```

2. **Run Migrations**
   Run the migration script which will create the database and apply all migrations:
   ```bash
   node scripts/migrate.js
   ```

3. **Verify Tables**
   If you have `psql`, you can verify:
   ```bash
   psql -d gator_marketplace -c "\dt"
   ```
   Or check the output of the migration script.

## Environment Variables
Ensure your `server/.env` (or environment) has:
```
DATABASE_URL=postgresql://localhost:5432/gator_marketplace
```
(Adjust user/password if necessary, e.g. `postgresql://user:password@localhost:5432/gator_marketplace`)
