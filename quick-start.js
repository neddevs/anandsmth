#!/usr/bin/env node

/**
 * Quick Start Script
 * This script helps you quickly test the integration after setup
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Anandmaya Quick Start');
console.log('============================\n');

// Check if .env files exist
const fs = require('fs');
const backendEnvPath = path.join(__dirname, 'backend', '.env');
const frontendEnvPath = path.join(__dirname, '.env');

if (!fs.existsSync(backendEnvPath)) {
  console.log('❌ Backend .env file not found. Please run setup first:');
  console.log('   npm run setup\n');
  process.exit(1);
}

if (!fs.existsSync(frontendEnvPath)) {
  console.log('❌ Frontend .env file not found. Please run setup first:');
  console.log('   npm run setup\n');
  process.exit(1);
}

console.log('✅ Configuration files found');
console.log('🔧 Starting backend server...\n');

// Start backend server
const backend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'pipe',
  shell: true
});

backend.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('Server running') || output.includes('MongoDB Connected')) {
    console.log('✅ Backend server started successfully');
    console.log('🌐 Backend running on: http://localhost:5000');
    console.log('📊 API Health Check: http://localhost:5000/api/health\n');
    
    // Start frontend after backend is ready
    setTimeout(() => {
      console.log('🔧 Starting frontend server...\n');
      
      const frontend = spawn('npm', ['start'], {
        cwd: __dirname,
        stdio: 'pipe',
        shell: true
      });

      frontend.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Local:') || output.includes('On Your Network:')) {
          console.log('✅ Frontend server started successfully');
          console.log('🌐 Frontend running on: http://localhost:3000');
          console.log('\n🎉 Both servers are running!');
          console.log('============================');
          console.log('You can now:');
          console.log('1. Open http://localhost:3000 in your browser');
          console.log('2. Test the login/signup functionality');
          console.log('3. Check the middleware example component');
          console.log('4. Run integration tests: npm run test:middleware');
          console.log('\nPress Ctrl+C to stop both servers');
        }
      });

      frontend.stderr.on('data', (data) => {
        console.error('Frontend error:', data.toString());
      });

      frontend.on('close', (code) => {
        console.log(`Frontend process exited with code ${code}`);
      });

      // Handle process termination
      process.on('SIGINT', () => {
        console.log('\n🛑 Stopping servers...');
        backend.kill();
        frontend.kill();
        process.exit(0);
      });

    }, 3000); // Wait 3 seconds for backend to fully start
  }
});

backend.stderr.on('data', (data) => {
  console.error('Backend error:', data.toString());
});

backend.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping backend server...');
  backend.kill();
  process.exit(0);
});









