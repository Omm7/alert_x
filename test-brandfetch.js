require('dotenv').config();

const apiKey = process.env.BRANDFETCH_API_KEY;

async function testBrandfetch() {
  try {
    console.log('Testing Brandfetch API...');
    console.log(`API Key: ${apiKey ? apiKey.substring(0, 10) + '...' : 'NOT SET'}\n`);

    const response = await fetch(`https://api.brandfetch.io/v2/brands/calix.com`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`Response Status: ${response.status}`);
    console.log(`Response Headers:`, response.headers);

    const data = await response.json();
    console.log(`\nResponse Data:`, JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testBrandfetch();
