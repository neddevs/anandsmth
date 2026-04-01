#!/usr/bin/env node

/**
 * Database Viewer Script
 * This script connects to MongoDB and shows all user data
 */

const mongoose = require('mongoose');
require('dotenv').config();

// User Schema (same as backend)
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, default: 'user' },
  isEmailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isLocked: { type: Boolean, default: false },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  lastLogin: { type: Date },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  preferences: {
    language: { type: String, default: 'en' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    }
  },
  spiritualProfile: {
    interests: [String],
    experience: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    goals: [String]
  }
}, {
  timestamps: true
});

// Add virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model('User', userSchema);

async function viewDatabase() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bhakti-bhoomi', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB successfully!\n');
    
    // Get all users
    const users = await User.find({}).select('-password'); // Exclude password for security
    
    console.log(`📊 Found ${users.length} users in the database:\n`);
    
    if (users.length === 0) {
      console.log('❌ No users found. Try registering a user first!');
      console.log('   Go to: http://localhost:3000/test-integration');
    } else {
      users.forEach((user, index) => {
        console.log(`👤 User ${index + 1}:`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Name: ${user.fullName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Phone: ${user.phone || 'Not provided'}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Email Verified: ${user.isEmailVerified ? 'Yes' : 'No'}`);
        console.log(`   Active: ${user.isActive ? 'Yes' : 'No'}`);
        console.log(`   Last Login: ${user.lastLogin ? user.lastLogin.toLocaleString() : 'Never'}`);
        console.log(`   Created: ${user.createdAt.toLocaleString()}`);
        
        if (user.address && (user.address.street || user.address.city)) {
          console.log(`   Address: ${user.address.street || ''} ${user.address.city || ''} ${user.address.state || ''}`);
        }
        
        if (user.spiritualProfile && user.spiritualProfile.interests && user.spiritualProfile.interests.length > 0) {
          console.log(`   Spiritual Interests: ${user.spiritualProfile.interests.join(', ')}`);
        }
        
        console.log('   ' + '─'.repeat(50));
      });
    }
    
    // Get database stats
    const stats = await User.collection.stats();
    console.log(`\n📈 Database Statistics:`);
    console.log(`   Total Documents: ${stats.count}`);
    console.log(`   Collection Size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`   Average Document Size: ${(stats.avgObjSize / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Troubleshooting:');
      console.log('1. Check your MongoDB connection string');
      console.log('2. Make sure your IP is whitelisted in MongoDB Atlas');
      console.log('3. Verify your username and password');
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the viewer
viewDatabase();









