# Architecture Overview

## High-Level Architecture

Gator Marketplace follows a standard client-server architecture.

### Frontend
- **Framework**: React (SPA)
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Communication**: Consumes the backend REST API via HTTP requests.

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **API Style**: RESTful API
- **Authentication**: JWT-based stateless authentication.
- **Database Interaction**: Uses `pg` library for direct SQL queries.

### Database
- **System**: PostgreSQL
- **Role**: Persistent storage for users, listings, and messages.

## Data Model

### Users
Represents the registered students.
- `id`: Primary Key
- `name`: Full name
- `email`: Unique email address
- `password_hash`: Bcrypt hashed password
- `created_at`: Timestamp

### Listings
Items listed for sale by users.
- `id`: Primary Key
- `title`: Title of the listing
- `description`: Detailed description
- `price`: Price in USD
- `category`: Item category (e.g., Books, Electronics)
- `image_url`: URL to the item image
- `seller_id`: Foreign Key linking to `Users`
- `is_active`: Boolean for soft deletion
- `created_at`: Timestamp

### Messages
Private messages between users.
- `id`: Primary Key
- `from_user_id`: Foreign Key linking to `Users` (Sender)
- `to_user_id`: Foreign Key linking to `Users` (Receiver)
- `listing_id`: Foreign Key linking to `Listings` (Optional context)
- `content`: Message text
- `created_at`: Timestamp
