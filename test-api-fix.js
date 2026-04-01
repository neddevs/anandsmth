#!/usr/bin/env node

/**
 * Test API Fix Script
 * This script tests if the API service is working correctly
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testAPIFix() {
  console.log('🔧 Testing API Fix');
  console.log('==================\n');

  try {
    // Test 1: Check backend health
    console.log('1️⃣ Testing backend health...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    
    if (healthResponse.data.success) {
      console.log('✅ Backend is running');
      console.log(`   Message: ${healthResponse.data.message}`);
    } else {
      console.log('❌ Backend health check failed');
      return;
    }

    // Test 2: Test registration
    console.log('\n2️⃣ Testing user registration...');
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@example.com`,
      password: 'TestPassword123'
    };

    try {
      const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
      
      if (registerResponse.data.success) {
        console.log('✅ Registration successful');
        console.log(`   User: ${registerResponse.data.data.user.fullName}`);
        console.log(`   Email: ${registerResponse.data.data.user.email}`);
        console.log(`   Token: ${registerResponse.data.data.token ? 'Generated' : 'Not generated'}`);
        
        // Test 3: Test login
        console.log('\n3️⃣ Testing user login...');
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: testUser.email,
          password: testUser.password
        });
        
        if (loginResponse.data.success) {
          console.log('✅ Login successful');
          console.log(`   User: ${loginResponse.data.data.user.fullName}`);
          
          // Test 4: Test get current user
          console.log('\n4️⃣ Testing get current user...');
          const meResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${loginResponse.data.data.token}`
            }
          });
          
          if (meResponse.data.success) {
            console.log('✅ Get current user successful');
            console.log(`   User: ${meResponse.data.data.user.fullName}`);
          } else {
            console.log('❌ Get current user failed');
          }
        } else {
          console.log('❌ Login failed');
        }
      } else {
        console.log('❌ Registration failed:', registerResponse.data.message);
      }
    } catch (registerError) {
      console.log('❌ Registration error:', registerError.response?.data?.message || registerError.message);
    }

    console.log('\n🎉 API Fix Test Complete!');
    console.log('If you see ✅ for all tests, the API is working correctly.');
    console.log('\nNext steps:');
    console.log('1. Start your frontend: npm start');
    console.log('2. Go to http://localhost:3000/signup');
    console.log('3. Test the signup form');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure your backend is running:');
    console.log('cd backend && npm start');
  }
}

// Run the test
testAPIFix();









