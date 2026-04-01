/**
 * Integration Test Service
 * Tests the middleware integration with the backend
 */

import apiService from './api';
import middlewareService from './middleware';

class IntegrationTestService {
  constructor() {
    this.testResults = [];
  }

  /**
   * Run all integration tests
   */
  async runAllTests() {
    console.log('🧪 Starting Integration Tests...');
    
    this.testResults = [];
    
    try {
      await this.testHealthCheck();
      await this.testRegistration();
      await this.testLogin();
      await this.testGetCurrentUser();
      await this.testUpdateProfile();
      await this.testLogout();
      
      this.printResults();
    } catch (error) {
      console.error('❌ Integration tests failed:', error);
    }
  }

  /**
   * Test health check endpoint
   */
  async testHealthCheck() {
    try {
      console.log('🔍 Testing Health Check...');
      const response = await apiService.healthCheck();
      
      if (response.success) {
        this.addTestResult('Health Check', true, 'Backend is responding');
      } else {
        this.addTestResult('Health Check', false, 'Backend health check failed');
      }
    } catch (error) {
      this.addTestResult('Health Check', false, error.message);
    }
  }

  /**
   * Test user registration
   */
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

      const response = await apiService.register(testUser);
      
      if (response.success && response.token) {
        this.addTestResult('User Registration', true, 'User registered successfully');
        
        // Store test user data for cleanup
        this.testUserData = {
          token: response.token,
          user: response.user
        };
      } else {
        this.addTestResult('User Registration', false, 'Registration failed');
      }
    } catch (error) {
      this.addTestResult('User Registration', false, error.message);
    }
  }

  /**
   * Test user login
   */
  async testLogin() {
    try {
      console.log('🔍 Testing User Login...');
      
      // First register a test user
      const testUser = {
        firstName: 'Login',
        lastName: 'Test',
        email: `logintest${Date.now()}@example.com`,
        password: 'LoginTest123',
        phone: '+1234567890'
      };

      await apiService.register(testUser);

      // Now test login
      const loginCredentials = {
        email: testUser.email,
        password: testUser.password
      };

      const response = await apiService.login(loginCredentials);
      
      if (response.success && response.token) {
        this.addTestResult('User Login', true, 'User logged in successfully');
      } else {
        this.addTestResult('User Login', false, 'Login failed');
      }
    } catch (error) {
      this.addTestResult('User Login', false, error.message);
    }
  }

  /**
   * Test get current user
   */
  async testGetCurrentUser() {
    try {
      console.log('🔍 Testing Get Current User...');
      
      // Ensure we have a logged-in user
      if (!apiService.isAuthenticated()) {
        this.addTestResult('Get Current User', false, 'No authenticated user');
        return;
      }

      const response = await apiService.getCurrentUser();
      
      if (response.success && response.user) {
        this.addTestResult('Get Current User', true, 'Current user retrieved successfully');
      } else {
        this.addTestResult('Get Current User', false, 'Failed to get current user');
      }
    } catch (error) {
      this.addTestResult('Get Current User', false, error.message);
    }
  }

  /**
   * Test update profile
   */
  async testUpdateProfile() {
    try {
      console.log('🔍 Testing Update Profile...');
      
      if (!apiService.isAuthenticated()) {
        this.addTestResult('Update Profile', false, 'No authenticated user');
        return;
      }

      const profileData = {
        firstName: 'Updated',
        lastName: 'Name',
        phone: '+9876543210'
      };

      const response = await apiService.updateProfile(profileData);
      
      if (response.success && response.user) {
        this.addTestResult('Update Profile', true, 'Profile updated successfully');
      } else {
        this.addTestResult('Update Profile', false, 'Profile update failed');
      }
    } catch (error) {
      this.addTestResult('Update Profile', false, error.message);
    }
  }

  /**
   * Test logout
   */
  async testLogout() {
    try {
      console.log('🔍 Testing User Logout...');
      
      if (!apiService.isAuthenticated()) {
        this.addTestResult('User Logout', false, 'No authenticated user to logout');
        return;
      }

      const response = await apiService.logout();
      
      if (response.success) {
        this.addTestResult('User Logout', true, 'User logged out successfully');
      } else {
        this.addTestResult('User Logout', false, 'Logout failed');
      }
    } catch (error) {
      this.addTestResult('User Logout', false, error.message);
    }
  }

  /**
   * Add test result
   */
  addTestResult(testName, passed, message) {
    this.testResults.push({
      test: testName,
      passed,
      message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Print test results
   */
  printResults() {
    console.log('\n📊 Integration Test Results:');
    console.log('============================');
    
    let passedCount = 0;
    let totalCount = this.testResults.length;

    this.testResults.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      console.log(`${status} ${result.test}: ${result.message}`);
      if (result.passed) passedCount++;
    });

    console.log('\n📈 Summary:');
    console.log(`Passed: ${passedCount}/${totalCount}`);
    console.log(`Success Rate: ${((passedCount / totalCount) * 100).toFixed(1)}%`);

    if (passedCount === totalCount) {
      console.log('\n🎉 All tests passed! Integration is working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the backend connection and configuration.');
    }
  }

  /**
   * Test middleware configuration
   */
  testMiddlewareConfig() {
    console.log('\n🔧 Middleware Configuration:');
    console.log('============================');
    console.log(`Base URL: ${middlewareService.baseURL}`);
    console.log(`Timeout: ${middlewareService.timeout}ms`);
    console.log(`Retry Attempts: ${middlewareService.retryAttempts}`);
    console.log(`Retry Delay: ${middlewareService.retryDelay}ms`);
    console.log(`Is Authenticated: ${apiService.isAuthenticated()}`);
    console.log(`Current User: ${apiService.getCurrentUserData() ? 'Yes' : 'No'}`);
  }
}

// Create and export a singleton instance
const integrationTestService = new IntegrationTestService();

// Make it available globally for testing
if (typeof window !== 'undefined') {
  window.integrationTest = integrationTestService;
}

export default integrationTestService;









