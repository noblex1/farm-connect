import fetch from 'node-fetch';

const testLogin = async () => {
  console.log('\n=================================');
  console.log('🧪 Testing Login API');
  console.log('=================================\n');

  const credentials = {
    emailOrPhone: "sharifiddrisu205@gmail.com",
    password: "123456789z"
  };

  console.log('Testing with:');
  console.log('Email:', credentials.emailOrPhone);
  console.log('Password:', credentials.password);
  console.log('\n');

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    console.log('Response Status:', response.status);
    console.log('Response Status Text:', response.statusText);
    console.log('\n');

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ LOGIN SUCCESSFUL!');
      console.log('\nUser Data:');
      console.log('- Name:', data.user.name);
      console.log('- Email:', data.user.email);
      console.log('- Phone:', data.user.phoneNumber);
      console.log('- Role:', data.user.role);
      console.log('\nToken:', data.token.substring(0, 50) + '...');
    } else {
      console.log('❌ LOGIN FAILED!');
      console.log('\nError:', data.message || data);
    }

    console.log('\n=================================\n');
  } catch (error) {
    console.error('❌ Request Error:', error.message);
  }
};

testLogin();
