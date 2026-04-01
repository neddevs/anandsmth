#!/usr/bin/env node

/**
 * Test Signup Flow Script
 * This script tests the complete signup flow to ensure data is stored in MongoDB
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testSignupFlow() {
  console.log('🧪 Testing Complete Signup Flow');
  console.log('================================\n');

  try {
    // Test 1: Check if backend is running
    console.log('1️⃣ Checking backend health...');
    try {
      const healthResponse = await axios.get(`${API_BASE_URL}/health`);
      if (healthResponse.data.success) {
        console.log('✅ Backend is running and healthy');
      } else {
        console.log('❌ Backend health check failed');
        return;
      }
    } catch (error) {
      console.log('❌ Backend is not running. Please start it first:');
      console.log('   cd backend && npm start');
      return;
    }

    // Test 2: Register a new user
    console.log('\n2️⃣ Testing user registration...');
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: `testuser${Date.now()}@example.com`,
      password: 'TestPassword123'
    };

    try {
      const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
      
      if (registerResponse.data.success) {
        console.log('✅ User registration successful');
        console.log(`   User ID: ${registerResponse.data.data.user.id}`);
        console.log(`   Email: ${registerResponse.data.data.user.email}`);
        console.log(`   Name: ${registerResponse.data.data.user.fullName}`);
        
        const token = registerResponse.data.data.token;
        console.log(`   Token: ${token ? 'Generated' : 'Not generated'}`);
        
        // Test 3: Verify user can login
        console.log('\n3️⃣ Testing user login...');
        try {
          const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
          });
          
          if (loginResponse.data.success) {
            console.log('✅ User login successful');
            console.log(`   User: ${loginResponse.data.data.user.fullName}`);
          } else {
            console.log('❌ User login failed');
          }
        } catch (loginError) {
          console.log('❌ Login error:', loginError.response?.data?.message || loginError.message);
        }
        
        // Test 4: Get current user
        console.log('\n4️⃣ Testing get current user...');
        try {
          const meResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (meResponse.data.success) {
            console.log('✅ Get current user successful');
            console.log(`   User: ${meResponse.data.data.user.fullName}`);
            console.log(`   Email: ${meResponse.data.data.user.email}`);
            console.log(`   Created: ${new Date(meResponse.data.data.user.createdAt).toLocaleString()}`);
          } else {
            console.log('❌ Get current user failed');
          }
        } catch (meError) {
          console.log('❌ Get current user error:', meError.response?.data?.message || meError.message);
        }
        
      } else {
        console.log('❌ User registration failed:', registerResponse.data.message);
      }
    } catch (registerError) {
      console.log('❌ Registration error:', registerError.response?.data?.message || registerError.message);
    }

    // Test 5: Check database directly
    console.log('\n5️⃣ Checking database for stored data...');
    console.log('   Run this command to view all users:');
    console.log('   npm run view-db');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testSignupFlow();









