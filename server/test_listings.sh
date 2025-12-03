#!/bin/bash

# 1. Signup/Login to get token
echo "--- Authenticating ---"
# Try signup first
RESPONSE=$(curl -s -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Seller","email":"seller_new@example.com","password":"password123"}')

# If signup fails (email in use), try login
if [[ $RESPONSE == *"Email already in use"* ]]; then
    echo "User exists, logging in..."
    RESPONSE=$(curl -s -X POST http://localhost:4000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"seller_new@example.com","password":"password123"}')
fi

TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Token: $TOKEN"

if [ -z "$TOKEN" ]; then
    echo "Failed to get token"
    exit 1
fi

# 2. Create Listing
echo "--- Creating Listing ---"
CREATE_RES=$(curl -s -X POST http://localhost:4000/api/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Textbook","description":"Calculus book","price":50,"category":"Books"}')
echo $CREATE_RES

LISTING_ID=$(echo $CREATE_RES | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
echo "Listing ID: $LISTING_ID"

# 3. List Listings
echo "--- Listing Listings ---"
curl -s http://localhost:4000/api/listings | grep "Textbook"

# 4. Get Listing Details
echo "--- Get Listing Details ---"
curl -s http://localhost:4000/api/listings/$LISTING_ID

# 5. Update Listing
echo "--- Updating Listing ---"
curl -s -X PUT http://localhost:4000/api/listings/$LISTING_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"price":45}'

# 6. Verify Update
echo "--- Verifying Update ---"
curl -s http://localhost:4000/api/listings/$LISTING_ID | grep "45"

# 7. Delete Listing
echo "--- Deleting Listing ---"
curl -s -X DELETE http://localhost:4000/api/listings/$LISTING_ID \
  -H "Authorization: Bearer $TOKEN"

# 8. Verify Delete
echo "--- Verifying Delete ---"
curl -s http://localhost:4000/api/listings | grep "Textbook" || echo "Listing not found (correct)"
