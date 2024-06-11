const express = require('express');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle file uploads
app.post('/upload', (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '/uploads');
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).send('Error uploading file');
        }

        const file = files.file;
        const filePath = path.join(__dirname, '/uploads', file.newFilename);

        // Send the link to the uploaded file
        res.send(`<a href="/uploads/${file.newFilename}">Download File</a>`);
    });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
