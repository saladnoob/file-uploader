const express = require('express');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs'); // For potential security checks

const app = express();
const PORT = 3000;

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle file uploads with validation and security checks
app.post('/upload', (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '/uploads');
  form.keepExtensions = true;
  form.maxFileSize = 10 * 1024 * 1024; // Set a maximum file size (optional)

  form.parse(req, (err, fields, files) => {
    if (err) {
      // Handle specific errors (e.g., file size exceeded)
      return res.status(500).send('Error uploading file: ' + err.message);
    }

    const file = files.file;

    // Basic file validation (optional)
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).send('Only image files allowed!');
    }

    // Additional security checks (optional)
    if (fs.existsSync(path.join(__dirname, '/uploads', file.newFilename))) {
      return res.status(400).send('File with that name already exists!');
    }

    const filePath = path.join(__dirname, '/uploads', file.newFilename);

    // Send the link to the uploaded file
    res.send(<a href="/uploads/${file.newFilename}">Download File</a>);
  });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(Server is running on http://localhost:${PORT});
});