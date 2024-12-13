import axios from 'axios';

// Handle the GET request explicitly
export async function GET(req, res) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  
  if (!username) {
    return new Response(JSON.stringify({ error: 'Username is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await axios.get(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`);
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error fetching data from LeetCode' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
