/**
 * Test script for middleware integration
 * Run this script to test the backend connection and middleware functionality
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

class MiddlewareTester {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
    this.user = null;
  }

  async testHealthCheck() {
    try {
      console.log('🔍 Testing Health Check...');
      const response = await axios.get(`${this.baseURL}/health`);
      
      if (response.data.success) {
        console.log('✅ Health check passed:', response.data.message);
        return true;
      } else {
        console.log('❌ Health check failed:', response.data.message);
        return false;
      }
    } catch (error) {
      console.log('❌ Health check error:', error.message);
      return false;
    }
  }

  async testRegistration() {
    try {
      console.log('🔍 Testing User Registration...');
      
      const testUser = {
        firstName: 'Test',
        lastName: 'User',
        email: `test${Date.now()}@example.com`,
        password: 'TestPassword123',
        phone: '+1234567890'
      };

      const response = await axios.post(`${this.baseURL}/auth/register`, testUser);
      
      if (response.data.success) {
        console.log('✅ Registration successful');
        this.token = response.data.data.token;
        this.user = response.data.data.user;
        return true;
      } else {
        console.log('❌ Registration failed:', response.data.message);
        return false;
      }
    } catch (error) {
      console.log('❌ Registration error:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async testLogin() {
    try {
      console.log('🔍 Testing User Login...');
      
      const credentials = {
        email: 'test@example.com',
        password: 'TestPassword123'
      };

      const response = await axios.post(`${this.baseURL}/auth/login`, credentials);
      
      if (response.data.success) {
        console.log('✅ Login successful');
        this.token = response.data.data.token;
        this.user = response.data.data.user;
        return true;
      } else {
        console.log('❌ Login failed:', response.data.message);
        return false;
      }
    } catch (error) {
      console.log('❌ Login error:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async testGetCurrentUser() {
    try {
      console.log('🔍 Testing Get Current User...');
      
      if (!this.token) {
        console.log('❌ No token available for authentication');
        return false;
      }

      const response = await axios.get(`${this.baseURL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      
      if (response.data.success) {
        console.log('✅ Get current user successful');
        this.user = response.data.data.user;
        return true;
      } else {
        console.log('❌ Get current user failed:', response.data.message);
        return false;
      }
    } catch (error) {
      console.log('❌ Get current user error:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async testUpdateProfile() {
    try {
      console.log('🔍 Testing Update Profile...');
      
      if (!this.token) {
        console.log('❌ No token available for authentication');
        return false;
      }

      const profileData = {
        firstName: 'Updated',
        lastName: 'Name',
        phone: '+9876543210'
      };

      const response = await axios.put(`${this.baseURL}/auth/profile`, profileData, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      
      if (response.data.success) {
        console.log('✅ Profile update successful');
        this.user = response.data.data.user;
        return true;
      } else {
        console.log('❌ Profile update failed:', response.data.message);
        return false;
      }
    } catch (error) {
      console.log('❌ Profile update error:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async testLogout() {
    try {
      console.log('🔍 Testing User Logout...');
      
      if (!this.token) {
        console.log('❌ No token available for authentication');
        return false;
      }

      const response = await axios.post(`${this.baseURL}/auth/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      
      if (response.data.success) {
        console.log('✅ Logout successful');
        this.token = null;
        this.user = null;
        return true;
      } else {
        console.log('❌ Logout failed:', response.data.message);
        return false;
      }
    } catch (error) {
      console.log('❌ Logout error:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async runAllTests() {
    console.log('🧪 Starting Middleware Integration Tests...');
    console.log('==========================================');
    
    const results = [];
    
    // Test health check
    results.push(await this.testHealthCheck());
    
    // Test registration
    results.push(await this.testRegistration());
    
    // Test login (with existing user)
    results.push(await this.testLogin());
    
    // Test get current user
    results.push(await this.testGetCurrentUser());
    
    // Test update profile
    results.push(await this.testUpdateProfile());
    
    // Test logout
    results.push(await this.testLogout());
    
    // Print results
    console.log('\n📊 Test Results:');
    console.log('================');
    const passedCount = results.filter(r => r).length;
    const totalCount = results.length;
    
    console.log(`Passed: ${passedCount}/${totalCount}`);
    console.log(`Success Rate: ${((passedCount / totalCount) * 100).toFixed(1)}%`);
    
    if (passedCount === totalCount) {
      console.log('\n🎉 All tests passed! Middleware integration is working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Please check your backend configuration.');
    }
    
    return results;
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const tester = new MiddlewareTester();
  tester.runAllTests().catch(console.error);
}

module.exports = MiddlewareTester;









