const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

exports.handler = async (event, context) => {
    if (event.httpMethod === 'POST') {
        const form = new formidable.IncomingForm();
        form.uploadDir = '/tmp';
        form.keepExtensions = true;

        return new Promise((resolve, reject) => {
            form.parse(event, (err, fields, files) => {
                if (err) {
                    reject({ statusCode: 500, body: 'Error uploading file' });
                    return;
                }

                const file = files.file;
                const filePath = path.join('/tmp', file.newFilename);

                resolve({
                    statusCode: 200,
                    body: JSON.stringify({ url: `/uploads/${file.newFilename}` }),
                });
            });
        });
    }

    return {
        statusCode: 405,
        body: 'Method Not Allowed',
    };
};
