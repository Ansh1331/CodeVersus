// app/api/github-proxy/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

const GITHUB_API = 'https://api.github.com';
const GITHUB_RAW_CONTENT = 'https://raw.githubusercontent.com';
const GITHUB_OWNER = 'gautam-4';
const GITHUB_REPO = 'codeversus';
const GITHUB_BRANCH = 'main';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  if (!path) {
    return NextResponse.json({ error: 'Path is required' }, { status: 400 });
  }

  let url;
  if (path === 'problems') {
    // For directory listing
    url = `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`;
  } else {
    // For file content
    url = `${GITHUB_RAW_CONTENT}/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`;
  }

  console.log('Fetching from URL:', url);

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3.raw'
      }
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching from GitHub:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error headers:', error.response?.headers);
    return NextResponse.json(
      { error: 'Error fetching from GitHub', details: error.message },
      { status: error.response?.status || 500 }
    );
  }
}