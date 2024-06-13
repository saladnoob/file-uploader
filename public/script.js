const uploadForm = document.getElementById('uploadForm');
const uploadStatus = document.getElementById('upload-status');

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission

  const formData = new FormData(uploadForm); // Create FormData object

  try {
    const response = await fetch('/.netlify/functions/upload', {
      method: 'POST',
      body: formData,
    });

    console.log('Fetch response:', response); // Log the entire response object

    if (!response.ok) {
      throw new Error(`Error uploading file: ${response.statusText} (Status Code: ${response.status})`);
    }

    const data = await response.json(); // Parse JSON response (assuming success message)
    console.log('Upload response data:', data); // Log the parsed JSON data

    uploadStatus.textContent = data.message; // Update upload status message
  } catch (error) {
    console.error('Error uploading file:', error);
    uploadStatus.textContent = 'Error uploading file. Check the console for details.';
  }
});
