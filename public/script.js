const formidable = require('formidable');
const fs = require('fs/promises'); // Use promises for asynchronous file operations

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const form = new formidable.IncomingForm();

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(event.body, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });

    // Check if a file was uploaded
    if (!files.file) {
      return {
        statusCode: 400,
        body: 'No file uploaded',
      };
    }

    const file = files.file;

    // Define the upload directory within your site's public directory
    const uploadDir = 'public/uploads';

    // Create the upload directory if it doesn't exist
    await fs.mkdir(uploadDir, { recursive: true }); // Create directory structure

    // Sanitize the file name (optional, light-touch security)
    const sanitizedFilename = file.originalFilename.replace(/[^\w.-]+/g, '_');

    // Build the upload path
    const filePath = path.join(uploadDir, sanitizedFilename);

    // Ensure file size is within acceptable limits (optional)
    if (file.size > 10 * 1024 * 1024) { // 10 MB limit (adjust as needed)
      return {
        statusCode: 413, // Payload Too Large
        body: 'File size exceeds limit (10 MB)',
      };
    }

    // Move the uploaded file to the destination
    await fs.rename(file.filepath, filePath);

    return {
      statusCode: 200,
      body: 'File uploaded successfully!',
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};
