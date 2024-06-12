const express = require('express');
const formidable = require('formidable');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle file uploads with size validation (no file type validation)
app.post('/upload', (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '/uploads');
  form.keepExtensions = true;
  // Set a maximum file size of 5 GB
  form.maxFileSize = 5 * 1024 * 1024 * 1024; 

  form.parse(req, (err, fields, files) => {
    if (err) {
      // Handle specific errors (e.g., file size exceeded)
      return res.status(500).send('Error uploading file: ' + err.message);
    }

    const file = files.file;

    // **Security Consideration:** Perform server-side file type validation here using libraries like 'mime'

    const filePath = path.join(__dirname, '/uploads', file.newFilename);

    // **Security Consideration:** Sanitize file name before saving

    // Send the link to the uploaded file
    res.send(<a href="/uploads/${file.newFilename}">Download File</a>);
  });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
