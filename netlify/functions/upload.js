const fs = require('fs/promises'); // Use promises for asynchronous file operations

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

  // Define the upload directory within your site's public directory (replace with your desired location)
  const uploadDir = 'public/uploads';

  // Create the upload directory if it doesn't exist
  await fs.mkdir(uploadDir, { recursive: true }); // Create directory recursively

  // Generate a unique filename (optional)
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${event.body.file.name.split('.').pop()}`;

  // Save the uploaded file
  await fs.writeFile(`${uploadDir}/${filename}`, fileData);

  return {
    statusCode: 200,
    body: 'File uploaded successfully!',
  };
};
