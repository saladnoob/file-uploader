const fs = require('fs'); // File system module

exports.handler = async (event, context) => {
  if (event.httpMethod === 'POST') {
    // Check if a file was uploaded
    if (!event.body || !event.body.file) {
      return {
        statusCode: 400,
        body: 'No file uploaded',
      };
    }

    // Extract the uploaded file data
    const fileData = Buffer.from(event.body.file, 'base64'); // Decode base64 data
    const filename = 'uploaded_file.txt'; // Adjust filename as needed

    // Create a folder for uploads (optional)
    const uploadDir = './uploads'; // Optional directory for uploads
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Create directory if it doesn't exist
    }

    const filePath = path.join(uploadDir, filename); // Combine path with filename

    try {
      // Write the uploaded file to the specified location
      await fs.promises.writeFile(filePath, fileData);
      return {
        statusCode: 200,
        body: 'File uploaded successfully!',
      };
    } catch (err) {
      console.error('Error uploading file:', err);
      return {
        statusCode: 500,
        body: 'Error uploading file',
      };
    }
  }

  return {
    statusCode: 405,
    body: 'Method Not Allowed',
  };
};
