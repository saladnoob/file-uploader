const uploadForm = document.querySelector('form');
const uploadStatus = document.getElementById('upload-status');

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission

  const formData = new FormData(uploadForm); // Create FormData object

  try {
    // Update the path to match your function location:
    const response = await fetch('/.netlify/functions/upload', { // Change to "/upload" if function is in netlify/functions
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error uploading file: ${response.statusText} (Status Code: ${response.status})`);
    }

    const data = await response.json(); // Parse JSON response (assuming success message)
    uploadStatus.textContent = data.message; // Update upload status message
  } catch (error) {
    console.error('Error uploading file:', error);
    uploadStatus.textContent = 'Error uploading file. Check the console for details.';
  }
});
