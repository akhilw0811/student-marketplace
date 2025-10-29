#!/usr/bin/env bash
set -e
echo "Login student"
STU=$(curl -s -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"student@ufl.edu","password":"Gator1234"}' | node -pe "JSON.parse(fs.readFileSync(0,'utf8')).token")
echo "Student token acquired"
echo "Create valid listing"
curl -s -X POST http://localhost:4000/api/listings \
  -H "Authorization: Bearer $STU" -H "Content-Type: application/json" \
  -d '{"title":"Algorithms Textbook","price":49,"category":"Textbooks","imageMeta":{"filename":"book.jpg","sizeMB":2,"mime":"image/jpeg"}}' | jq .
echo "Create invalid listing (exe) -> expect 400"
curl -i -s -X POST http://localhost:4000/api/listings \
  -H "Authorization: Bearer $STU" -H "Content-Type: application/json" \
  -d "{\"title\":\"Bad File\",\"price\":1,\"imageMeta\":{\"filename\":\"script.exe\",\"sizeMB\":1,\"mime\":\"application/x-msdownload\"}}" | head -n 20
echo "Search textbook <= 50 page 1"
curl -s "http://localhost:4000/api/listings?q=textbook&priceMax=50&page=1" | jq .


