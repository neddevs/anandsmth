/**
 * Environment Configuration
 * Centralized configuration for API endpoints and environment settings
 */

const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000/api',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
  },
  production: {
    API_BASE_URL: process.env.REACT_APP_API_URL || 'https://anandmaya-backend.onrender.com/api', //https://your-api-domain.com/api
    TIMEOUT: 15000,
    RETRY_ATTEMPTS: 2,
    RETRY_DELAY: 2000,
  },
  test: {
    API_BASE_URL: 'http://localhost:5000/api',
    TIMEOUT: 5000,
    RETRY_ATTEMPTS: 1,
    RETRY_DELAY: 500,
  }
};

const environment = process.env.NODE_ENV || 'development';
const currentConfig = config[environment] || config.development;

export default {
  ...currentConfig,
  environment,
  isDevelopment: environment === 'development',
  isProduction: environment === 'production',
  isTest: environment === 'test',
};
