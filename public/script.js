const uploadForm = document.querySelector('form');
const uploadStatus = document.getElementById('upload-status');

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission

  const formData = new FormData(uploadForm); // Create FormData object

  try {
    const response = await fetch('/.netlify/functions/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json(); // Parse JSON response

    uploadStatus.textContent = data.body; // Update upload status message
  } catch (error) {
    console.error('Error uploading file:', error);
    uploadStatus.textContent = 'Error uploading file. Check the console for details.';
  }
});
