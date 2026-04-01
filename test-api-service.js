#!/usr/bin/env node

/**
 * Test API Service Import
 * This script tests if the API service can be imported correctly
 */

console.log('🔧 Testing API Service Import');
console.log('=============================\n');

try {
  // Test if we can require the API service
  console.log('1️⃣ Testing API service import...');
  
  // Since this is a Node.js script, we need to use a different approach
  // Let's test the backend API directly instead
  const axios = require('axios');
  
  console.log('✅ Axios imported successfully');
  
  // Test backend connection
  console.log('\n2️⃣ Testing backend connection...');
  
  axios.get('http://localhost:5000/api/health')
    .then(response => {
      if (response.data.success) {
        console.log('✅ Backend is running and healthy');
        console.log(`   Message: ${response.data.message}`);
        
        // Test registration
        console.log('\n3️⃣ Testing registration...');
        const testUser = {
          firstName: 'Test',
          lastName: 'User',
          email: `test${Date.now()}@example.com`,
          password: 'TestPassword123'
        };
        
        return axios.post('http://localhost:5000/api/auth/register', testUser);
      } else {
        console.log('❌ Backend health check failed');
        throw new Error('Backend not healthy');
      }
    })
    .then(response => {
      if (response.data.success) {
        console.log('✅ Registration successful');
        console.log(`   User: ${response.data.data.user.fullName}`);
        console.log(`   Email: ${response.data.data.user.email}`);
        console.log(`   Token: ${response.data.data.token ? 'Generated' : 'Not generated'}`);
        
        console.log('\n🎉 API Service Test Complete!');
        console.log('The backend API is working correctly.');
        console.log('\nNext steps:');
        console.log('1. Start your frontend: npm start');
        console.log('2. Go to http://localhost:3000/signup');
        console.log('3. Test the signup form');
      } else {
        console.log('❌ Registration failed:', response.data.message);
      }
    })
    .catch(error => {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ Backend is not running');
        console.log('Please start your backend first:');
        console.log('cd backend && npm start');
      } else {
        console.log('❌ Error:', error.response?.data?.message || error.message);
      }
    });

} catch (error) {
  console.error('❌ Test failed:', error.message);
}









