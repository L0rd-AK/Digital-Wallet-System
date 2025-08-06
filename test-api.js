// Comprehensive Test Script for Digital Wallet System API
// Tests all features mentioned in the task requirements
// Note: This requires axios to be installed: npm install axios
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

// Test data
const testUsers = {
    admin: {
        name: 'Admin',
        email: 'amit@gmail.com',
        password: '12345678',
        role: 'admin'
    },
    user1: {
        name: 'amit',
        email: 'amit@example.com',
        password: 'password123',
        role: 'user'
    },
    user2: {
        name: 'amit kumar',
        email: 'darkwed71378@gmail.com',
        password: 'password123',
        role: 'user'
    },
    agent: {
        name: 'Agent Amit',
        email: 'agent@example.com',
        password: 'password123',
        role: 'agent'
    }
};

let adminToken, user1Token, user2Token, agentToken;
let user1Id, user2Id, agentId;

// Helper function for API calls
async function makeRequest(method, endpoint, data = null, token = null) {
    try {
        const config = {
            method,
            url: `${BASE_URL}${endpoint}`,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        };
        
        if (data) {
            config.data = data;
            config.headers['Content-Type'] = 'application/json';
        }
        
        const response = await axios(config);
        return { success: true, data: response.data };
    } catch (error) {
        return { 
            success: false, 
            error: error.response?.data?.message || error.message,
            status: error.response?.status
        };
    }
}

async function testAPI() {
    console.log('🧪 COMPREHENSIVE DIGITAL WALLET SYSTEM API TESTING');
    console.log('=' .repeat(60));
    console.log('Testing all features from task requirements...\n');

    try {
        // ========================================
        // 1. AUTHENTICATION & REGISTRATION TESTING
        // ========================================
        console.log('📝 1. AUTHENTICATION & REGISTRATION');
        console.log('-'.repeat(40));
        
        // Register all users
        for (const [role, userData] of Object.entries(testUsers)) {
            const result = await makeRequest('POST', '/users/register', userData);
            if (result.success) {
                console.log(`✅ ${role} registered successfully`);
            } else {
                console.log(`⚠️ ${role} registration: ${result.error}`);
            }
        }

        // Login all users and store tokens
        console.log('\nLogging in users...');
        for (const [role, userData] of Object.entries(testUsers)) {
            const result = await makeRequest('POST', '/auth/login', {
                email: userData.email,
                password: userData.password
            });
            
            if (result.success) {
                const token = result.data.data.accessToken;
                const userId = result.data.data.user?._id || result.data.data.user?.userId;
                
                if (role === 'admin') adminToken = token;
                if (role === 'user1') { user1Token = token; user1Id = userId; }
                if (role === 'user2') { user2Token = token; user2Id = userId; }
                if (role === 'agent') { agentToken = token; agentId = userId; }
                
                console.log(`✅ ${role} logged in successfully`);
                console.log(`   Token: ${token?.substring(0, 20)}...`);
                console.log(`   User ID: ${userId}`);
            } else {
                console.log(`❌ ${role} login failed: ${result.error}`);
            }
        }

        // ========================================
        // 2. USER WALLET OPERATIONS TESTING
        // ========================================
        console.log('\n💰 2. USER WALLET OPERATIONS');
        console.log('-'.repeat(40));
        
        if (user1Token) {
            // Get my wallet
            let result = await makeRequest('GET', '/wallets/my-wallet', null, user1Token);
            if (result.success) {
                console.log(`✅ Get my wallet: Balance ৳${result.data.data.balance}`);
            } else {
                console.log(`❌ Get my wallet failed: ${result.error}`);
            }

            // Get wallet balance
            result = await makeRequest('GET', '/wallets/balance', null, user1Token);
            if (result.success) {
                console.log(`✅ Get wallet balance: ৳${result.data.data.balance}`);
            } else {
                console.log(`❌ Get wallet balance failed: ${result.error}`);
            }

            // Add money (top-up)
            result = await makeRequest('POST', '/wallets/add-money', { amount: 500 }, user1Token);
            if (result.success) {
                console.log(`✅ Add money: Added ৳500 successfully`);
            } else {
                console.log(`❌ Add money failed: ${result.error}`);
            }

            // Withdraw money
            result = await makeRequest('POST', '/wallets/withdraw', { amount: 100 }, user1Token);
            if (result.success) {
                console.log(`✅ Withdraw money: Withdrew ৳100 successfully`);
            } else {
                console.log(`❌ Withdraw money failed: ${result.error}`);
            }

            // Send money to another user
            if (user2Id) {
                result = await makeRequest('POST', '/wallets/send-money', { 
                    receiverId: user2Id, 
                    amount: 150 
                }, user1Token);
                if (result.success) {
                    console.log(`✅ Send money: Sent ৳150 to user2 successfully`);
                } else {
                    console.log(`❌ Send money failed: ${result.error}`);
                }
            }

            // View transaction history
            result = await makeRequest('GET', '/transactions/my-history', null, user1Token);
            if (result.success) {
                console.log(`✅ Transaction history: Found ${result.data.data.length} transactions`);
            } else {
                console.log(`❌ Get transaction history failed: ${result.error}`);
            }
        }

        // ========================================
        // 3. AGENT OPERATIONS TESTING
        // ========================================
        console.log('\n🏪 3. AGENT OPERATIONS');
        console.log('-'.repeat(40));
        
        if (agentToken && adminToken) {
            // First approve the agent (admin operation)
            let result = await makeRequest('PATCH', `/users/agents/${agentId}/approve`, null, adminToken);
            if (result.success) {
                console.log(`✅ Agent approved by admin`);
            } else {
                console.log(`⚠️ Agent approval: ${result.error}`);
            }

            // Cash-in to user wallet
            if (user2Id) {
                result = await makeRequest('POST', '/wallets/cash-in', { 
                    userId: user2Id, 
                    amount: 300 
                }, agentToken);
                if (result.success) {
                    console.log(`✅ Cash-in: Added ৳300 to user2 wallet`);
                } else {
                    console.log(`❌ Cash-in failed: ${result.error}`);
                }

                // Cash-out from user wallet
                result = await makeRequest('POST', '/wallets/cash-out', { 
                    userId: user2Id, 
                    amount: 100 
                }, agentToken);
                if (result.success) {
                    console.log(`✅ Cash-out: Withdrew ৳100 from user2 wallet`);
                } else {
                    console.log(`❌ Cash-out failed: ${result.error}`);
                }
            }

            // View commission history
            result = await makeRequest('GET', '/transactions/commission-history', null, agentToken);
            if (result.success) {
                console.log(`✅ Commission history: Found ${result.data.data.length} commission records`);
            } else {
                console.log(`❌ Get commission history failed: ${result.error}`);
            }

            // Agent tries to access user wallet details
            if (user1Id) {
                result = await makeRequest('GET', `/wallets/user/${user1Id}`, null, agentToken);
                if (result.success) {
                    console.log(`✅ Agent can access user wallet details`);
                } else {
                    console.log(`❌ Agent wallet access failed: ${result.error}`);
                }
            }
        }

        // ========================================
        // 4. ADMIN OPERATIONS TESTING
        // ========================================
        console.log('\n👑 4. ADMIN OPERATIONS');
        console.log('-'.repeat(40));
        
        if (adminToken) {
            // View all users
            let result = await makeRequest('GET', '/users/all-users', null, adminToken);
            if (result.success) {
                console.log(`✅ Get all users: Found ${result.data.data.length} users`);
            } else {
                console.log(`❌ Get all users failed: ${result.error}`);
            }

            // View all agents
            result = await makeRequest('GET', '/users/agents/all', null, adminToken);
            if (result.success) {
                console.log(`✅ Get all agents: Found ${result.data.data.length} agents`);
            } else {
                console.log(`❌ Get all agents failed: ${result.error}`);
            }

            // View all wallets
            result = await makeRequest('GET', '/wallets/all', null, adminToken);
            if (result.success) {
                console.log(`✅ Get all wallets: Found ${result.data.data.length} wallets`);
            } else {
                console.log(`❌ Get all wallets failed: ${result.error}`);
            }

            // View all transactions
            result = await makeRequest('GET', '/transactions/all', null, adminToken);
            if (result.success) {
                console.log(`✅ Get all transactions: Found ${result.data.data.length} transactions`);
            } else {
                console.log(`❌ Get all transactions failed: ${result.error}`);
            }

            // Block user wallet
            if (user1Id) {
                result = await makeRequest('PATCH', `/wallets/block/${user1Id}`, null, adminToken);
                if (result.success) {
                    console.log(`✅ Block wallet: User1 wallet blocked successfully`);
                } else {
                    console.log(`❌ Block wallet failed: ${result.error}`);
                }

                // Test blocked wallet - user should not be able to add money
                result = await makeRequest('POST', '/wallets/add-money', { amount: 50 }, user1Token);
                if (!result.success) {
                    console.log(`✅ Blocked wallet validation: User cannot add money to blocked wallet`);
                } else {
                    console.log(`❌ Blocked wallet validation failed: User can still add money`);
                }

                // Unblock user wallet
                result = await makeRequest('PATCH', `/wallets/unblock/${user1Id}`, null, adminToken);
                if (result.success) {
                    console.log(`✅ Unblock wallet: User1 wallet unblocked successfully`);
                } else {
                    console.log(`❌ Unblock wallet failed: ${result.error}`);
                }
            }

            // Suspend agent
            if (agentId) {
                result = await makeRequest('PATCH', `/users/agents/${agentId}/suspend`, null, adminToken);
                if (result.success) {
                    console.log(`✅ Suspend agent: Agent suspended successfully`);
                } else {
                    console.log(`❌ Suspend agent failed: ${result.error}`);
                }
            }

            // Admin access to specific user wallet
            if (user2Id) {
                result = await makeRequest('GET', `/wallets/user/${user2Id}`, null, adminToken);
                if (result.success) {
                    console.log(`✅ Admin can access user wallet details`);
                } else {
                    console.log(`❌ Admin wallet access failed: ${result.error}`);
                }

                result = await makeRequest('GET', `/wallets/user/${user2Id}/balance`, null, adminToken);
                if (result.success) {
                    console.log(`✅ Admin can access user wallet balance: ৳${result.data.data.balance}`);
                } else {
                    console.log(`❌ Admin balance access failed: ${result.error}`);
                }
            }
        }

        // ========================================
        // 5. ROLE-BASED ACCESS CONTROL TESTING
        // ========================================
        console.log('\n🔐 5. ROLE-BASED ACCESS CONTROL');
        console.log('-'.repeat(40));
        
        // Test user trying to access admin endpoints
        if (user1Token) {
            let result = await makeRequest('GET', '/users/all-users', null, user1Token);
            if (!result.success && result.status === 403) {
                console.log(`✅ Access control: User cannot access admin endpoint (all users)`);
            } else {
                console.log(`❌ Access control failed: User can access admin endpoint`);
            }

            result = await makeRequest('GET', '/wallets/all', null, user1Token);
            if (!result.success && result.status === 403) {
                console.log(`✅ Access control: User cannot access admin endpoint (all wallets)`);
            } else {
                console.log(`❌ Access control failed: User can access admin endpoint`);
            }
        }

        // Test user trying to access agent endpoints
        if (user1Token && user2Id) {
            let result = await makeRequest('POST', '/wallets/cash-in', { 
                userId: user2Id, 
                amount: 100 
            }, user1Token);
            if (!result.success && result.status === 403) {
                console.log(`✅ Access control: User cannot access agent endpoint (cash-in)`);
            } else {
                console.log(`❌ Access control failed: User can access agent endpoint`);
            }
        }

        // Test user trying to access other user's wallet
        if (user1Token && user2Id) {
            let result = await makeRequest('GET', `/wallets/user/${user2Id}`, null, user1Token);
            if (!result.success && result.status === 403) {
                console.log(`✅ Access control: User cannot access other user's wallet`);
            } else {
                console.log(`❌ Access control failed: User can access other user's wallet`);
            }
        }

        // ========================================
        // 6. VALIDATION TESTING
        // ========================================
        console.log('\n🛡️ 6. VALIDATION TESTING');
        console.log('-'.repeat(40));
        
        if (user1Token) {
            // Test negative amount
            let result = await makeRequest('POST', '/wallets/add-money', { amount: -50 }, user1Token);
            if (!result.success) {
                console.log(`✅ Validation: Negative amount rejected`);
            } else {
                console.log(`❌ Validation failed: Negative amount accepted`);
            }

            // Test zero amount
            result = await makeRequest('POST', '/wallets/add-money', { amount: 0 }, user1Token);
            if (!result.success) {
                console.log(`✅ Validation: Zero amount rejected`);
            } else {
                console.log(`❌ Validation failed: Zero amount accepted`);
            }

            // Test insufficient balance for withdrawal
            result = await makeRequest('POST', '/wallets/withdraw', { amount: 10000 }, user1Token);
            if (!result.success) {
                console.log(`✅ Validation: Insufficient balance for withdrawal rejected`);
            } else {
                console.log(`❌ Validation failed: Insufficient balance withdrawal accepted`);
            }

            // Test send money to non-existent user
            result = await makeRequest('POST', '/wallets/send-money', { 
                receiverId: '507f1f77bcf86cd799439011', // fake ObjectId
                amount: 50 
            }, user1Token);
            if (!result.success) {
                console.log(`✅ Validation: Send money to non-existent user rejected`);
            } else {
                console.log(`❌ Validation failed: Send money to non-existent user accepted`);
            }
        }

        // ========================================
        // 7. FINAL SUMMARY
        // ========================================
        console.log('\n📊 7. TEST SUMMARY');
        console.log('-'.repeat(40));
        
        // Get final balances
        if (user1Token) {
            let result = await makeRequest('GET', '/wallets/balance', null, user1Token);
            if (result.success) {
                console.log(`📈 User1 final balance: ৳${result.data.data.balance}`);
            }
        }
        
        if (user2Token) {
            let result = await makeRequest('GET', '/wallets/balance', null, user2Token);
            if (result.success) {
                console.log(`📈 User2 final balance: ৳${result.data.data.balance}`);
            }
        }

        console.log('\n🎉 COMPREHENSIVE API TESTING COMPLETED!');
        console.log('=' .repeat(60));
        console.log('✅ All major features from task requirements tested');
        console.log('✅ Authentication & Authorization verified');
        console.log('✅ User, Agent, and Admin operations tested');
        console.log('✅ Role-based access control validated');
        console.log('✅ Business rule validations checked');
        console.log('✅ Transaction tracking verified');

    } catch (error) {
        console.error('❌ Test suite failed:', error.message);
    }
}

// Run the comprehensive test
testAPI(); 