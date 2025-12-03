#!/bin/bash

# 1. Setup Users (User A and User B)
echo "--- Authenticating Users ---"
# User A
TOKEN_A=$(curl -s -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"User A","email":"usera@example.com","password":"password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN_A" ]; then
    # Login if exists
    TOKEN_A=$(curl -s -X POST http://localhost:4000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"usera@example.com","password":"password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
fi

# User B
TOKEN_B=$(curl -s -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"User B","email":"userb@example.com","password":"password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN_B" ]; then
     # Login if exists
    TOKEN_B=$(curl -s -X POST http://localhost:4000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"userb@example.com","password":"password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
fi

# Get User IDs
USER_A_ID=$(curl -s http://localhost:4000/api/auth/me -H "Authorization: Bearer $TOKEN_A" | grep -o '"id":[0-9]*' | cut -d':' -f2)
USER_B_ID=$(curl -s http://localhost:4000/api/auth/me -H "Authorization: Bearer $TOKEN_B" | grep -o '"id":[0-9]*' | cut -d':' -f2)

echo "User A ID: $USER_A_ID"
echo "User B ID: $USER_B_ID"

# 2. User A sends message to User B
echo "--- User A sending message to User B ---"
curl -s -X POST http://localhost:4000/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_A" \
  -d "{\"toUserId\":$USER_B_ID, \"content\":\"Hello User B!\"}"

# 3. User B replies to User A
echo "--- User B replying to User A ---"
curl -s -X POST http://localhost:4000/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_B" \
  -d "{\"toUserId\":$USER_A_ID, \"content\":\"Hi User A, nice to meet you!\"}"

# 4. User A lists messages (Inbox/Sent)
echo "--- User A listing all messages ---"
curl -s http://localhost:4000/api/messages -H "Authorization: Bearer $TOKEN_A" | grep "Hello User B"

# 5. User A views conversation with User B
echo "--- User A viewing conversation with User B ---"
CONVO=$(curl -s http://localhost:4000/api/messages/$USER_B_ID -H "Authorization: Bearer $TOKEN_A")
echo $CONVO | grep "Hello User B"
echo $CONVO | grep "nice to meet you"
