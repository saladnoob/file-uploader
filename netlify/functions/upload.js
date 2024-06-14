const formidable = require('formidable');
const fs = require('fs/promises');
const path = require('path');

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event));

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: 'CORS preflight handled.' }),
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: 'Method Not Allowed',
    };
  }

  const form = new formidable.IncomingForm();
  const uploadDir = '/tmp/uploads'; // Use /tmp for Netlify Functions

  try {
    await fs.mkdir(uploadDir, { recursive: true });

    const formDataPromise = new Promise((resolve, reject) => {
      form.parse(event, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });

    const { fields, files } = await formDataPromise;

    if (!files.file) {
      console.log('No file uploaded');
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: 'No fil
