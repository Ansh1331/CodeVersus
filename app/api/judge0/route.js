import { NextResponse } from 'next/server';
import axios from 'axios';

const JUDGE0_API = 'https://judge0-ce.p.rapidapi.com/submissions';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const JUDGE0_API_HOST = process.env.JUDGE0_API_HOST;

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Request body:', body);

    // Encode source_code and stdin to base64
    const encodedBody = {
      ...body,
      source_code: Buffer.from(body.source_code).toString('base64'),
      stdin: Buffer.from(body.stdin).toString('base64'),
      expected_output: body.expected_output ? Buffer.from(body.expected_output).toString('base64') : undefined
    };

    const response = await axios.post(`${JUDGE0_API}?base64_encoded=true`, encodedBody, {
      headers: {
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': JUDGE0_API_HOST,
        'Content-Type': 'application/json'
      }
    });
    console.log('Response from Judge0:', response.data);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error creating submission:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: error.response?.status || 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(`${JUDGE0_API}/${token}?base64_encoded=true`, {
      headers: {
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': JUDGE0_API_HOST
      }
    });
    console.log('Result of submission (base64):', response.data);

    // Decode base64 encoded fields
    const decodedData = {
      ...response.data,
      stdout: response.data.stdout ? Buffer.from(response.data.stdout, 'base64').toString() : null,
      stderr: response.data.stderr ? Buffer.from(response.data.stderr, 'base64').toString() : null,
      compile_output: response.data.compile_output ? Buffer.from(response.data.compile_output, 'base64').toString() : null,
    };
    console.log('Decoded result of submission:', decodedData);

    return NextResponse.json(decodedData);
  } catch (error) {
    console.error('Error fetching submission result:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: error.response?.status || 500 }
    );
  }
}