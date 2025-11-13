const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001/api';

// Test configuration
const TEST_ADMIN = {
  email: 'admin@example.com',
  password: 'admin123'
};

const TEST_VOLUNTEER = {
  email: 'john@example.com',
  password: 'john123'
};

const NEW_USER_DATA = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'testpass123',
  phone: '555-999-8888',
  role: 'Volunteer',
  reason: 'New volunteer joining the team for community service'
};

async function makeRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error('Request failed:', error.message);
    return { status: 500, data: { error: error.message } };
  }
}

async function loginUser(email, password) {
  console.log(`\n📧 Logging in as: ${email}`);
  const result = await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  if (result.status === 200) {
    console.log('✅ Login successful');
    return result.data.token;
  } else {
    console.log('❌ Login failed:', result.data.error);
    return null;
  }
}

async function testRegistration(token, userData, expectedStatus, testName) {
  console.log(`\n🧪 Testing: ${testName}`);
  
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  
  const result = await makeRequest('/auth/register', {
    method: 'POST',
    headers,
    body: JSON.stringify(userData)
  });
  
  console.log(`📊 Status: ${result.status} (expected: ${expectedStatus})`);
  
  if (result.status === expectedStatus) {
    console.log('✅ Test passed');
    if (result.data.user) {
      console.log(`👤 Created user: ${result.data.user.name} (${result.data.user.role})`);
      console.log(`📝 Reason: ${result.data.user.reason}`);
    }
  } else {
    console.log('❌ Test failed');
    console.log('📄 Response:', result.data);
  }
  
  return result;
}

async function runTests() {
  console.log('🚀 Starting Admin Registration Tests\n');
  console.log('=' * 50);
  
  // Test 1: Try to register without authentication (should fail)
  await testRegistration(
    null, 
    NEW_USER_DATA, 
    401, 
    'Registration without authentication'
  );
  
  // Test 2: Login as regular volunteer and try to register (should fail)
  const volunteerToken = await loginUser(TEST_VOLUNTEER.email, TEST_VOLUNTEER.password);
  if (volunteerToken) {
    await testRegistration(
      volunteerToken, 
      NEW_USER_DATA, 
      403, 
      'Registration with volunteer account'
    );
  }
  
  // Test 3: Login as admin and try to register without role (should fail)
  const adminToken = await loginUser(TEST_ADMIN.email, TEST_ADMIN.password);
  if (adminToken) {
    const incompleteData = { ...NEW_USER_DATA };
    delete incompleteData.role;
    await testRegistration(
      adminToken, 
      incompleteData, 
      400, 
      'Registration without role'
    );
  }
  
  // Test 4: Login as admin and try to register without reason (should fail)
  if (adminToken) {
    const incompleteData = { ...NEW_USER_DATA };
    delete incompleteData.reason;
    await testRegistration(
      adminToken, 
      incompleteData, 
      400, 
      'Registration without reason'
    );
  }
  
  // Test 5: Login as admin and register with invalid role (should fail)
  if (adminToken) {
    const invalidRoleData = { ...NEW_USER_DATA, role: 'InvalidRole' };
    await testRegistration(
      adminToken, 
      invalidRoleData, 
      400, 
      'Registration with invalid role'
    );
  }
  
  // Test 6: Login as admin and register successfully (should succeed)
  if (adminToken) {
    await testRegistration(
      adminToken, 
      NEW_USER_DATA, 
      201, 
      'Successful admin registration'
    );
  }
  
  // Test 7: Try to register the same user again (should fail - duplicate email)
  if (adminToken) {
    await testRegistration(
      adminToken, 
      NEW_USER_DATA, 
      400, 
      'Duplicate email registration'
    );
  }
  
  console.log('\n' + '=' * 50);
  console.log('🏁 Tests completed!');
  console.log('\nNote: Make sure your backend server is running on http://localhost:3001');
  console.log('and that you have admin and volunteer test accounts set up.');
}

// Run the tests
runTests().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
}); 