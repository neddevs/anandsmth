#!/usr/bin/env node

/**
 * MongoDB Connection Finder
 * This script helps you find and test your MongoDB connection
 */

const mongoose = require('mongoose');

async function testMongoDBConnection(uri) {
  try {
    console.log(`🔍 Testing connection: ${uri.replace(/\/\/.*@/, '//***:***@')}`);
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });
    
    console.log('✅ Connection successful!');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    
    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    return false;
  }
}

async function findMongoDB() {
  console.log('🔍 MongoDB Connection Finder');
  console.log('==========================\n');
  
  const commonConnections = [
    // Local MongoDB
    'mongodb://localhost:27017/bhakti-bhoomi',
    'mongodb://127.0.0.1:27017/bhakti-bhoomi',
    
    // Common Atlas patterns (you'll need to replace with your actual credentials)
    'mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bhakti-bhoomi?retryWrites=true&w=majority',
  ];
  
  console.log('Testing common MongoDB connections...\n');
  
  for (const uri of commonConnections) {
    const success = await testMongoDBConnection(uri);
    if (success) {
      console.log(`\n🎉 Found working connection: ${uri}`);
      console.log('\n📋 Use this connection string in your setup:');
      console.log(`   ${uri}`);
      return;
    }
    console.log(''); // Empty line for readability
  }
  
  console.log('❌ No working connections found.');
  console.log('\n📝 Please provide your MongoDB connection string:');
  console.log('   1. Go to MongoDB Atlas (https://cloud.mongodb.com)');
  console.log('   2. Click "Connect" on your cluster');
  console.log('   3. Choose "Connect your application"');
  console.log('   4. Copy the connection string');
  console.log('   5. Run: npm run setup');
}

// Run the finder
findMongoDB().catch(console.error);









