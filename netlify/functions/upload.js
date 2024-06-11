const fs = require('fs');
const { Octokit } = require("@octokit/rest"); // GitHub API library

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  // Check if a file was uploaded
  if (!event.body || !event.body.file) {
    return {
      statusCode: 400,
      body: 'No file uploaded',
    };
  }

  // Extract the uploaded file data
  const fileData = Buffer.from(event.body.file, 'base64');
  const filename = 'uploaded_file.txt'; // Adjust filename as needed

  // Optional: Create a personal access token for GitHub API access
  // https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app
  const githubToken = process.env.GITHUB_TOKEN; // Replace with your token

  if (!githubToken) {
    return {
      statusCode: 401,
      body: 'Missing GitHub access token',
    };
  }

  const octokit = new Octokit({ auth: githubToken });

  // Get the owner and repo name from your Netlify site configuration
  const owner = 'saladnoob'; // Replace with your username
  const repo = 'file-uploader'; // Replace with your repo name

  const content = fileData.toString('base64'); // Encode file content as base64

  try {
    // Create or update the file content in the repository
    const response = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filename,
      message: 'Uploaded file from Netlify function',
      content,
    });

    return {
      statusCode: 200,
      body: 'File uploaded successfully!',
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      statusCode: 500,
      body: 'Error uploading file',
    };
  }
};
