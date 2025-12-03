const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

async function testListings() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'test@ufl.edu',
            password: 'pass123'
        });
        const token = loginRes.data.token;
        console.log('Login successful. Token obtained.');

        // 2. Create Listing
        console.log('Creating listing...');
        const listingData = {
            title: 'Test Textbook',
            description: 'Test Description',
            price: 100,
            category: 'Textbooks',
            image_url: 'http://example.com/image.jpg'
        };
        const createRes = await axios.post(`${API_URL}/listings`, listingData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Listing created:', createRes.data);

        // 3. Get Listings
        console.log('Fetching listings...');
        const getRes = await axios.get(`${API_URL}/listings`);
        console.log('Listings fetched:', getRes.data);

        const found = getRes.data.listings.find(l => l.title === 'Test Textbook');
        if (found) {
            console.log('SUCCESS: Listing found in feed.');
        } else {
            console.error('FAILURE: Listing NOT found in feed.');
        }

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testListings();
