/**
 * Test script for Signup and Signin APIs
 * Run with: node test-auth-apis.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';

// Test data
const testUser = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  role: 'user',
  password: 'password123'
};

const testLogin = {
  email: 'john.doe@example.com',
  password: 'password123'
};

const testLoginWrongEmail = {
  email: 'nonexistent@example.com',
  password: 'password123'
};

const testLoginWrongPassword = {
  email: 'john.doe@example.com',
  password: 'wrongpassword'
};

async function testSignup() {
  console.log('🧪 Testing Signup API...');
  try {
    const response = await axios.post(`${BASE_URL}/register`, testUser);
    console.log('✅ Signup Success:');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Signup Error:');
    console.log('Status:', error.response?.status);
    console.log('Response:', error.response?.data);
  }
}

async function testSignin() {
  console.log('\n🧪 Testing Signin API...');
  try {
    const response = await axios.post(`${BASE_URL}/login`, testLogin);
    console.log('✅ Signin Success:');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Signin Error:');
    console.log('Status:', error.response?.status);
    console.log('Response:', error.response?.data);
  }
}

async function testSigninWrongEmail() {
  console.log('\n🧪 Testing Signin with Wrong Email...');
  try {
    const response = await axios.post(`${BASE_URL}/login`, testLoginWrongEmail);
    console.log('✅ Response (Expected):');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Error:');
    console.log('Status:', error.response?.status);
    console.log('Response:', error.response?.data);
  }
}

async function testSigninWrongPassword() {
  console.log('\n🧪 Testing Signin with Wrong Password...');
  try {
    const response = await axios.post(`${BASE_URL}/login`, testLoginWrongPassword);
    console.log('✅ Response (Expected):');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Error:');
    console.log('Status:', error.response?.status);
    console.log('Response:', error.response?.data);
  }
}

async function runTests() {
  console.log('🚀 Starting Auth API Tests...\n');
  
  await testSignup();
  await testSignin();
  await testSigninWrongEmail();
  await testSigninWrongPassword();
  
  console.log('\n✨ Tests completed!');
}

// Run tests
runTests().catch(console.error);








