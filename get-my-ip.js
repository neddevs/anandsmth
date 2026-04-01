#!/usr/bin/env node

/**
 * Get Current IP Address
 * This script gets your current public IP address for MongoDB Atlas whitelist
 */

const https = require('https');

function getCurrentIP() {
  return new Promise((resolve, reject) => {
    https.get('https://api.ipify.org', (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data.trim());
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function showIP() {
  try {
    console.log('🌐 Getting your current IP address...\n');
    const ip = await getCurrentIP();
    
    console.log('✅ Your current IP address is:');
    console.log(`   ${ip}\n`);
    
    console.log('📋 Next steps:');
    console.log('1. Go to MongoDB Atlas (https://cloud.mongodb.com)');
    console.log('2. Sign in to your account');
    console.log('3. Click on your project');
    console.log('4. Click "Network Access" in the left sidebar');
    console.log('5. Click "Add IP Address"');
    console.log('6. Choose "Add Current IP Address" or paste:');
    console.log(`   ${ip}`);
    console.log('7. Click "Confirm"');
    console.log('\n🎉 After adding your IP, try connecting again!');
    
  } catch (error) {
    console.error('❌ Could not get IP address:', error.message);
    console.log('\n📝 You can also:');
    console.log('1. Go to https://whatismyipaddress.com/');
    console.log('2. Copy your IP address');
    console.log('3. Add it to MongoDB Atlas Network Access');
  }
}

showIP();









