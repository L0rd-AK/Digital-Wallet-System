// Test script for Digital Wallet System API
// Note: This requires axios to be installed: npm install axios
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

// Test data
const testUsers = {
    admin: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
    },
    user: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
    },
    agent: {
        name: 'Agent Smith',
        email: 'agent@example.com',
        password: 'password123',
        role: 'agent'
    }
};

let adminToken, userToken, agentToken;

async function testAPI() {
    console.log('🧪 Testing Digital Wallet System API\n');

    try {
        // 1. Register users
        console.log('1. Registering users...');
        
        for (const [role, userData] of Object.entries(testUsers)) {
            try {
                const response = await axios.post(`${BASE_URL}/users/register`, userData);
                console.log(`✅ ${role} registered successfully`);
            } catch (error) {
                console.log(`⚠️ ${role} registration: ${error.response?.data?.message || error.message}`);
            }
        }

        // 2. Login users
        console.log('\n2. Logging in users...');
        
        for (const [role, userData] of Object.entries(testUsers)) {
            try {
                const response = await axios.post(`${BASE_URL}/auth/login`, {
                    email: userData.email,
                    password: userData.password
                });
                
                if (role === 'admin') adminToken = response.data.data.accessToken;
                if (role === 'user') userToken = response.data.data.accessToken;
                if (role === 'agent') agentToken = response.data.data.accessToken;
                
                console.log(`✅ ${role} logged in successfully`);
            } catch (error) {
                console.log(`❌ ${role} login failed: ${error.response?.data?.message || error.message}`);
            }
        }

        // 3. Test wallet operations
        if (userToken) {
            console.log('\n3. Testing wallet operations...');
            
            // Get wallet balance
            try {
                const balanceResponse = await axios.get(`${BASE_URL}/wallets/balance`, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                console.log(`✅ Wallet balance: ${balanceResponse.data.data.balance}`);
            } catch (error) {
                console.log(`❌ Get balance failed: ${error.response?.data?.message || error.message}`);
            }

            // Add money
            try {
                const addMoneyResponse = await axios.post(`${BASE_URL}/wallets/add-money`, {
                    amount: 100
                }, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                console.log(`✅ Added money: ${addMoneyResponse.data.message}`);
            } catch (error) {
                console.log(`❌ Add money failed: ${error.response?.data?.message || error.message}`);
            }
        }

        // 4. Test admin operations
        if (adminToken) {
            console.log('\n4. Testing admin operations...');
            
            // Get all users
            try {
                const usersResponse = await axios.get(`${BASE_URL}/users/all-users`, {
                    headers: { Authorization: `Bearer ${adminToken}` }
                });
                console.log(`✅ Retrieved ${usersResponse.data.data.length} users`);
            } catch (error) {
                console.log(`❌ Get users failed: ${error.response?.data?.message || error.message}`);
            }

            // Get all wallets
            try {
                const walletsResponse = await axios.get(`${BASE_URL}/wallets/all`, {
                    headers: { Authorization: `Bearer ${adminToken}` }
                });
                console.log(`✅ Retrieved ${walletsResponse.data.data.length} wallets`);
            } catch (error) {
                console.log(`❌ Get wallets failed: ${error.response?.data?.message || error.message}`);
            }
        }

        // 5. Test transaction history
        if (userToken) {
            console.log('\n5. Testing transaction history...');
            
            try {
                const historyResponse = await axios.get(`${BASE_URL}/transactions/my-history`, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                console.log(`✅ Retrieved ${historyResponse.data.data.length} transactions`);
            } catch (error) {
                console.log(`❌ Get transaction history failed: ${error.response?.data?.message || error.message}`);
            }
        }

        console.log('\n🎉 API testing completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testAPI(); 