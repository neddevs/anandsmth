#!/usr/bin/env node

/**
 * MongoDB Connection Fix Script
 * This script helps you fix the MongoDB connection issue
 */

const mongoose = require('mongoose');

async function testMongoDBConnection() {
  console.log('🔧 MongoDB Connection Fix');
  console.log('========================\n');

  const connectionStrings = [
    // Original connection string
    'mongodb+srv://suryanbray_db_user:Surya@mongo2025@cluster0.j98ntxt.mongodb.net/bhakti-bhoomi',
    
    // URL encoded password
    'mongodb+srv://suryanbray_db_user:Surya%40mongo2025@cluster0.j98ntxt.mongodb.net/bhakti-bhoomi',
    
    // Alternative format
    'mongodb+srv://suryanbray_db_user:Surya%40mongo2025@cluster0.j98ntxt.mongodb.net/bhakti-bhoomi?retryWrites=true&w=majority'
  ];

  for (let i = 0; i < connectionStrings.length; i++) {
    const uri = connectionStrings[i];
    console.log(`\n${i + 1}️⃣ Testing connection string ${i + 1}:`);
    console.log(`   ${uri.replace(/\/\/.*@/, '//***:***@')}`);
    
    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
      
      console.log('   ✅ Connection successful!');
      console.log(`   📊 Database: ${mongoose.connection.db.databaseName}`);
      console.log(`   🌐 Host: ${mongoose.connection.host}`);
      
      await mongoose.disconnect();
      console.log('\n🎉 MongoDB connection is working!');
      console.log('\nNext steps:');
      console.log('1. Update your backend/.env file with the working connection string');
      console.log('2. Start your backend server: cd backend && npm start');
      console.log('3. Start your frontend: npm start');
      console.log('4. Test the signup form at http://localhost:3000/signup');
      return;
      
    } catch (error) {
      console.log(`   ❌ Connection failed: ${error.message}`);
      
      if (error.message.includes('authentication failed')) {
        console.log('   💡 This means the username/password is incorrect');
        console.log('   🔧 Solution: Check your MongoDB Atlas credentials');
      } else if (error.message.includes('ENOTFOUND')) {
        console.log('   💡 This means the cluster URL is incorrect');
        console.log('   🔧 Solution: Check your MongoDB Atlas cluster URL');
      } else if (error.message.includes('IP not whitelisted')) {
        console.log('   💡 This means your IP address is not whitelisted');
        console.log('   🔧 Solution: Add your IP to MongoDB Atlas Network Access');
      }
    }
  }
  
  console.log('\n❌ All connection attempts failed.');
  console.log('\n🔧 Troubleshooting steps:');
  console.log('1. Go to MongoDB Atlas (https://cloud.mongodb.com)');
  console.log('2. Check your cluster URL and credentials');
  console.log('3. Make sure your IP is whitelisted in Network Access');
  console.log('4. Verify your database user exists and has the correct password');
  console.log('5. Try creating a new database user with a simple password');
}

// Run the test
testMongoDBConnection().catch(console.error);









