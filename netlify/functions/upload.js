const formidable = require('formidable');
const fs = require('fs/promises');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    // Handle CORS preflight request
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

  // Create a promise to handle form parsing
  const formDataPromise = new Promise((resolve, reject) => {
    form.parse(event, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });

  try {
    // Ensure the upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const { fields, files } = await formDataPromise;

    if (!files.file) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: 'No file uploaded',
      };
    }

    const file = files.file;
    const sanitizedFilename = file.originalFilename.replace(/[^\w.-]+/g, '_');
    const filePath = path.join(uploadDir, sanitizedFilename);

    if (file.size > 10 * 1024 * 1024) {
      return {
        statusCode: 413,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: 'File size exceeds limit (10 MB)',
      };
    }

    await fs.rename(file.filepath, filePath);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'File uploaded successfully!' }),
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: 'Internal Server Error',
    };
  }
};
