/**
 * Test script to start server and test endpoints
 */

const { spawn } = require('child_process');
const axios = require('axios');

// Start the server
console.log('🚀 Starting backend server...');
const server = spawn('node', ['server.js'], {
  cwd: '/Users/suryanbray/Downloads/projects/Figma_To_Code/backend',
  stdio: 'pipe'
});

// Handle server output
server.stdout.on('data', (data) => {
  console.log('Server:', data.toString());
});

server.stderr.on('data', (data) => {
  console.log('Server Error:', data.toString());
});

// Wait for server to start
setTimeout(async () => {
  try {
    console.log('\n🧪 Testing API endpoints...');
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:5002/api/health');
    console.log('✅ Health check:', healthResponse.data);
    
    // Test signup endpoint
    const signupData = {
      fullName: 'Test User',
      email: 'test@example.com',
      role: 'user',
      password: 'password123'
    };
    
    try {
      const signupResponse = await axios.post('http://localhost:5002/api/auth/register', signupData);
      console.log('✅ Signup test:', signupResponse.data);
    } catch (error) {
      console.log('❌ Signup error:', error.response?.data || error.message);
    }
    
    // Test login endpoint
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    try {
      const loginResponse = await axios.post('http://localhost:5002/api/auth/login', loginData);
      console.log('✅ Login test:', loginResponse.data);
    } catch (error) {
      console.log('❌ Login error:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.log('❌ Connection error:', error.message);
  } finally {
    // Kill the server
    server.kill();
    console.log('\n🛑 Server stopped');
  }
}, 5000);








