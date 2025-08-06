const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

async function quickTest() {
    try {
        // Login as admin
        const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'amit@gmail.com',
            password: '12345678'
        });
        
        const adminToken = adminLogin.data.data.accessToken;
        console.log('✅ Admin login successful');
        console.log('Token:', adminToken.substring(0, 20) + '...');

        // Test admin accessing all users (should work)
        const allUsers = await axios.get(`${BASE_URL}/users/all-users`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ Admin can access all users:', allUsers.data.data.length, 'users found');

        // Test admin accessing all agents (should work)
        const allAgents = await axios.get(`${BASE_URL}/users/agents/all`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ Admin can access all agents:', allAgents.data.data.length, 'agents found');

        // Login as agent
        const agentLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'agent@example.com',
            password: 'password123'
        });
        
        const agentToken = agentLogin.data.data.accessToken;
        const agentId = agentLogin.data.data.user._id;
        console.log('✅ Agent login successful');

        // Test agent approval
        const approval = await axios.patch(`${BASE_URL}/users/agents/${agentId}/approve`, {}, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ Agent approved successfully');

        // Test agent cash-in after approval
        const cashIn = await axios.post(`${BASE_URL}/wallets/cash-in`, {
            userId: '6893af76c6eca729ad0b4c2d', // user2 ID from test
            amount: 100
        }, {
            headers: { Authorization: `Bearer ${agentToken}` }
        });
        console.log('✅ Agent cash-in successful');

    } catch (error) {
        console.error('❌ Error:', error.response?.data?.message || error.message);
        console.error('Status:', error.response?.status);
    }
}

quickTest();
