// Test script for email booking functionality
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const testBooking = async () => {
  try {
    console.log('🧪 Testing Pooja Booking with Email Notification...\n');

    const bookingData = {
      devoteeName: 'Test Devotee',
      email: 'test@example.com',
      phone: '9876543210',
      poojaType: 'daily',
      temple: 'tirupati',
      poojaDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
      poojaTime: '10:00',
      specialRequests: 'This is a test booking to verify email functionality'
    };

    console.log('📝 Booking Data:');
    console.log(JSON.stringify(bookingData, null, 2));
    console.log('\n🚀 Sending booking request...\n');

    const response = await fetch('http://localhost:5002/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Booking Successful!');
      console.log('📧 Email Status:', result.data.emailSent ? 'Sent' : 'Failed');
      console.log('🆔 Booking ID:', result.data.bookingId);
      console.log('💰 Amount: ₹' + result.data.amount);
      
      if (result.data.previewUrl) {
        console.log('👀 Email Preview URL:', result.data.previewUrl);
        console.log('   (Click the link to view the email in your browser)');
      }
      
      console.log('\n📋 Booking Details:');
      console.log('   Devotee:', result.data.devoteeName);
      console.log('   Pooja Type:', result.data.poojaType);
      console.log('   Temple:', result.data.temple);
      console.log('   Date:', result.data.poojaDate);
      console.log('   Time:', result.data.poojaTime);
      
    } else {
      console.log('❌ Booking Failed!');
      console.log('Error:', result.message);
      if (result.errors) {
        console.log('Validation Errors:', result.errors);
      }
    }

  } catch (error) {
    console.error('💥 Test Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the backend server is running (npm run dev)');
    console.log('2. Check if MongoDB is connected');
    console.log('3. Verify the API endpoint is accessible');
  }
};

// Run the test
testBooking();
