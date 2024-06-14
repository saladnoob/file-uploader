const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  const { filename } = event.queryStringParameters;

  if (!filename) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: 'Filename query parameter is required',
    };
  }

  const filePath = path.join('/tmp/uploads', filename); // Use /tmp for Netlify Functions

  try {
    if (!fs.existsSync(filePath)) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: 'File not found',
      };
    }

    const fileContent = await fs.promises.readFile(filePath);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
      body: fileContent.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Error downloading file:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: 'Internal Server Error',
    };
  }
};
