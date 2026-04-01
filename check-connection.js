#!/usr/bin/env node

/**
 * Connection Check Script
 * This script checks if the backend is running and accessible
 */

const axios = require('axios');

async function checkConnection() {
  console.log('🔍 Checking Backend Connection');
  console.log('==============================\n');

  const backendUrl = 'http://localhost:5000';
  const apiUrl = 'http://localhost:5000/api';

  try {
    // Test 1: Check if backend server is running
    console.log('1️⃣ Checking if backend server is running...');
    
    try {
      const response = await axios.get(`${apiUrl}/health`, { timeout: 5000 });
      
      if (response.data.success) {
        console.log('✅ Backend is running and healthy!');
        console.log(`   Message: ${response.data.message}`);
        console.log(`   Environment: ${response.data.environment}`);
        console.log(`   Timestamp: ${response.data.timestamp}`);
      } else {
        console.log('❌ Backend responded but health check failed');
        console.log(`   Response: ${JSON.stringify(response.data)}`);
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ Backend server is not running');
        console.log('\n🔧 Solution:');
        console.log('1. Open a new terminal');
        console.log('2. Navigate to backend directory: cd backend');
        console.log('3. Start the backend: npm start');
        console.log('4. Wait for "Server running" message');
        console.log('5. Try again');
        return;
      } else if (error.code === 'ENOTFOUND') {
        console.log('❌ Cannot resolve localhost');
        console.log('\n🔧 Solution:');
        console.log('1. Check your internet connection');
        console.log('2. Try restarting your computer');
        console.log('3. Check if localhost is blocked by firewall');
        return;
      } else {
        console.log('❌ Backend connection error:', error.message);
        console.log('\n🔧 Possible solutions:');
        console.log('1. Check if backend is running on port 5000');
        console.log('2. Check if port 5000 is available');
        console.log('3. Check firewall settings');
        return;
      }
    }

    // Test 2: Check specific API endpoints
    console.log('\n2️⃣ Testing API endpoints...');
    
    const endpoints = [
      { path: '/health', method: 'GET', auth: false },
      { path: '/auth/register', method: 'POST', auth: false },
      { path: '/auth/login', method: 'POST', auth: false }
    ];

    for (const endpoint of endpoints) {
      try {
        const config = {
          method: endpoint.method,
          url: `${apiUrl}${endpoint.path}`,
          timeout: 5000
        };

        if (endpoint.method === 'POST') {
          config.data = { test: 'data' };
          config.headers = { 'Content-Type': 'application/json' };
        }

        const response = await axios(config);
        console.log(`   ✅ ${endpoint.method} ${endpoint.path} - OK`);
      } catch (error) {
        if (error.response) {
          console.log(`   ⚠️  ${endpoint.method} ${endpoint.path} - ${error.response.status} (Expected for test data)`);
        } else {
          console.log(`   ❌ ${endpoint.method} ${endpoint.path} - ${error.message}`);
        }
      }
    }

    // Test 3: Check port availability
    console.log('\n3️⃣ Checking port 5000...');
    try {
      const net = require('net');
      const server = net.createServer();
      
      server.listen(5000, () => {
        console.log('   ✅ Port 5000 is available');
        server.close();
      });
      
      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log('   ⚠️  Port 5000 is in use (this is expected if backend is running)');
        } else {
          console.log('   ❌ Port 5000 error:', err.message);
        }
      });
    } catch (error) {
      console.log('   ❌ Could not check port:', error.message);
    }

    console.log('\n🎉 Connection Check Complete!');
    console.log('If you see ✅ for the health check, your backend is working.');
    console.log('\nNext steps:');
    console.log('1. Start your frontend: npm start');
    console.log('2. Go to http://localhost:3000/signup');
    console.log('3. Test the signup form');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the check
checkConnection();









