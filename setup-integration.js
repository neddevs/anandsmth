#!/usr/bin/env node

/**
 * Integration Setup Script
 * This script helps you set up the complete integration between frontend, backend, and MongoDB
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupIntegration() {
  console.log('🚀 Anandmaya Integration Setup');
  console.log('==================================\n');

  try {
    // Get MongoDB connection details
    console.log('📊 MongoDB Configuration');
    console.log('------------------------');
    
    const mongoUri = await question('Enter your MongoDB connection string (e.g., mongodb+srv://username:password@cluster.mongodb.net/bhakti-bhoomi): ');
    
    if (!mongoUri) {
      console.log('❌ MongoDB URI is required. Exiting...');
      process.exit(1);
    }

    // Get JWT secret
    const jwtSecret = await question('Enter JWT secret (or press Enter for auto-generated): ');
    const finalJwtSecret = jwtSecret || generateJWTSecret();

    // Get backend port
    const backendPort = await question('Enter backend port (default: 5000): ') || '5000';

    // Get frontend port
    const frontendPort = await question('Enter frontend port (default: 3000): ') || '3000';

    console.log('\n🔧 Creating configuration files...');

    // Create backend .env file
    const backendEnvContent = `# Database Configuration
MONGODB_URI=${mongoUri}

# JWT Configuration
JWT_SECRET=${finalJwtSecret}
JWT_EXPIRE=7d

# Server Configuration
PORT=${backendPort}
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:${frontendPort}
`;

    fs.writeFileSync(path.join(__dirname, 'backend', '.env'), backendEnvContent);
    console.log('✅ Backend .env file created');

    // Create frontend .env file
    const frontendEnvContent = `REACT_APP_API_URL=http://localhost:${backendPort}/api
REACT_APP_ENVIRONMENT=development
`;

    fs.writeFileSync(path.join(__dirname, '.env'), frontendEnvContent);
    console.log('✅ Frontend .env file created');

    // Create .env.example files
    const backendEnvExample = `# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bhakti-bhoomi?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:3000
`;

    fs.writeFileSync(path.join(__dirname, 'backend', '.env.example'), backendEnvExample);

    const frontendEnvExample = `REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
`;

    fs.writeFileSync(path.join(__dirname, '.env.example'), frontendEnvExample);

    console.log('\n📋 Next Steps:');
    console.log('==============');
    console.log('1. Install backend dependencies:');
    console.log('   cd backend && npm install');
    console.log('');
    console.log('2. Install frontend dependencies:');
    console.log('   npm install');
    console.log('');
    console.log('3. Start the backend server:');
    console.log('   cd backend && npm start');
    console.log('');
    console.log('4. Start the frontend server (in a new terminal):');
    console.log('   npm start');
    console.log('');
    console.log('5. Test the integration:');
    console.log('   npm run test:middleware');
    console.log('');
    console.log('6. Open your browser and go to:');
    console.log(`   http://localhost:${frontendPort}`);
    console.log('');
    console.log('🎉 Setup complete! Your integration is ready to use.');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

function generateJWTSecret() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Run the setup
setupIntegration();









