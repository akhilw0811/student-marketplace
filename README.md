# Gator Marketplace

A student-only marketplace for buying and selling items within the campus community.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL

### Installation

1.  **Clone the repository**

2.  **Install dependencies**

    Install dependencies for both the client and server:

    ```bash
    cd client
    npm install
    cd ../server
    npm install
    ```

### Database Setup

1.  Create a PostgreSQL database named `student_marketplace`.
2.  Run the migration scripts located in `db/migrations` to set up the schema.

### Configuration

1.  Navigate to the `server` directory.
2.  Create a `.env` file based on `.env.example`.
3.  Configure the following environment variables:
    - `PORT`: Server port (default: 3000)
    - `DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://user:password@localhost:5432/student_marketplace`)
    - `JWT_SECRET`: Secret key for signing tokens

### Running the Application

You need to run both the backend and frontend servers.

1.  **Start the Backend Server**

    ```bash
    cd server
    npm run dev
    ```

    The server will start on `http://localhost:3000` (or your configured PORT).

2.  **Start the Frontend Development Server**

    ```bash
    cd client
    npm run dev
    ```

    The frontend will be available at `http://localhost:5173`.
