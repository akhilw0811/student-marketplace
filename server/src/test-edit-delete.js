const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

async function testEditDelete() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'test@ufl.edu',
            password: 'pass123'
        });
        const token = loginRes.data.token;
        console.log('Login successful.');

        // 2. Create Listing
        console.log('Creating listing to edit...');
        const createRes = await axios.post(`${API_URL}/listings`, {
            title: 'To Be Edited',
            description: 'Original Description',
            price: 10,
            category: 'Other',
            imageUrl: 'http://example.com/img.jpg'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const listingId = createRes.data.listing.id;
        console.log(`Listing created with ID: ${listingId}`);

        // 3. Edit Listing
        console.log('Editing listing...');
        const editRes = await axios.put(`${API_URL}/listings/${listingId}`, {
            title: 'Edited Title',
            price: 20
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Edit response:', editRes.data);

        // 4. Verify Edit
        console.log('Verifying edit...');
        const getRes = await axios.get(`${API_URL}/listings/${listingId}`);
        if (getRes.data.listing.title === 'Edited Title' && getRes.data.listing.price === '20.00') {
            console.log('SUCCESS: Listing updated correctly.');
        } else {
            console.error('FAILURE: Listing did NOT update correctly.', getRes.data.listing);
        }

        // 5. Delete Listing
        console.log('Deleting listing...');
        await axios.delete(`${API_URL}/listings/${listingId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Listing deleted.');

        // 6. Verify Delete
        console.log('Verifying delete...');
        try {
            await axios.get(`${API_URL}/listings/${listingId}`);
            console.error('FAILURE: Listing still exists after delete.');
        } catch (err) {
            if (err.response && err.response.status === 404) {
                console.log('SUCCESS: Listing not found (deleted).');
            } else {
                console.error('Error verifying delete:', err.message);
            }
        }

    } catch (error) {
        console.error('Test Error:', error.response ? error.response.data : error.message);
    }
}

testEditDelete();
