# API Documentation

Base URL: `/api`

## Authentication

### Sign Up
Create a new user account.

- **URL**: `/auth/signup`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Success Response** (201 Created):
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

### Login
Authenticate an existing user.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Success Response** (200 OK):
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

### Get Current User
Get details of the currently authenticated user.

- **URL**: `/auth/me`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response** (200 OK):
  ```json
  {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

## Listings

### Get All Listings
Retrieve a list of active listings. Supports filtering.

- **URL**: `/listings`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**:
  - `q`: Search query (title or description)
  - `category`: Filter by category
  - `minPrice`: Minimum price
  - `maxPrice`: Maximum price
- **Success Response** (200 OK):
  ```json
  {
    "listings": [
      {
        "id": 1,
        "title": "Textbook",
        "price": "50.00",
        "category": "Books",
        "image_url": "http://example.com/image.jpg",
        "created_at": "..."
      }
    ]
  }
  ```

### Get Listing Details
Get detailed information about a specific listing.

- **URL**: `/listings/:id`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response** (200 OK):
  ```json
  {
    "listing": {
      "id": 1,
      "title": "Textbook",
      "description": "Calculus textbook",
      "price": "50.00",
      "category": "Books",
      "seller_name": "John Doe",
      "seller_email": "john@example.com"
    }
  }
  ```

### Create Listing
Create a new listing.

- **URL**: `/listings`
- **Method**: `POST`
- **Auth Required**: Yes
- **Body**:
  ```json
  {
    "title": "Laptop",
    "description": "Used laptop in good condition",
    "price": 500,
    "category": "Electronics",
    "imageUrl": "http://example.com/laptop.jpg"
  }
  ```
- **Success Response** (201 Created):
  ```json
  {
    "listing": {
      "id": 2,
      "title": "Laptop",
      "..."
    }
  }
  ```

### Update Listing
Update an existing listing. Only the owner can update.

- **URL**: `/listings/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Body** (all fields optional):
  ```json
  {
    "price": 450
  }
  ```
- **Success Response** (200 OK):
  ```json
  {
    "listing": { ... }
  }
  ```

### Delete Listing
Soft delete a listing. Only the owner can delete.

- **URL**: `/listings/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Success Response** (200 OK):
  ```json
  {
    "message": "Listing deleted successfully"
  }
  ```

## Messaging

### Get All Conversations
Get all messages for the current user.

- **URL**: `/messages`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response** (200 OK):
  ```json
  {
    "messages": [ ... ]
  }
  ```

### Get Conversation
Get conversation history with a specific user.

- **URL**: `/messages/:userId`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response** (200 OK):
  ```json
  {
    "messages": [ ... ]
  }
  ```

### Send Message
Send a message to another user.

- **URL**: `/messages`
- **Method**: `POST`
- **Auth Required**: Yes
- **Body**:
  ```json
  {
    "toUserId": 2,
    "content": "Is this still available?",
    "listingId": 1
  }
  ```
- **Success Response** (201 Created):
  ```json
  {
    "message": {
      "id": 1,
      "from_user_id": 1,
      "to_user_id": 2,
      "content": "Is this still available?",
      "created_at": "..."
    }
  }
  ```
