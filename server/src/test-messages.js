const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

async function testMessages() {
    try {
        // 1. Login as User 1 (Sender)
        console.log('Logging in as User 1...');
        const loginRes1 = await axios.post(`${API_URL}/auth/login`, {
            email: 'test@ufl.edu',
            password: 'pass123'
        });
        const token1 = loginRes1.data.token;
        const user1Id = loginRes1.data.user.id;
        console.log(`User 1 logged in (ID: ${user1Id})`);

        // 2. Login as User 2 (Receiver) - Create if not exists or use a known one
        // For simplicity, let's create a new user
        console.log('Creating User 2...');
        const email2 = `user2_${Date.now()}@test.com`;
        const signupRes2 = await axios.post(`${API_URL}/auth/signup`, {
            name: 'User Two',
            email: email2,
            password: 'pass123'
        });
        const token2 = signupRes2.data.token;
        const user2Id = signupRes2.data.user.id;
        console.log(`User 2 created (ID: ${user2Id})`);

        // 3. Send Message from User 1 to User 2
        console.log('Sending message from User 1 to User 2...');
        const sendRes = await axios.post(`${API_URL}/messages`, {
            toUserId: user2Id,
            content: 'Hello User 2!'
        }, {
            headers: { Authorization: `Bearer ${token1}` }
        });
        console.log('Message sent:', sendRes.data);

        // 4. Get Messages for User 1 (Thread list)
        console.log('Fetching messages for User 1...');
        const getRes1 = await axios.get(`${API_URL}/messages`, {
            headers: { Authorization: `Bearer ${token1}` }
        });
        console.log('User 1 Messages:', getRes1.data.messages.length);
        if (getRes1.data.messages.find(m => m.content === 'Hello User 2!')) {
            console.log('SUCCESS: Message found in User 1 list.');
        } else {
            console.error('FAILURE: Message NOT found in User 1 list.');
        }

        // 5. Get Conversation for User 2
        console.log('Fetching conversation for User 2...');
        const getRes2 = await axios.get(`${API_URL}/messages/${user1Id}`, {
            headers: { Authorization: `Bearer ${token2}` }
        });
        console.log('User 2 Conversation:', getRes2.data.messages.length);
        if (getRes2.data.messages.find(m => m.content === 'Hello User 2!')) {
            console.log('SUCCESS: Message found in User 2 conversation.');
        } else {
            console.error('FAILURE: Message NOT found in User 2 conversation.');
        }

    } catch (error) {
        console.error('Test Error:', error.response ? error.response.data : error.message);
    }
}

testMessages();
