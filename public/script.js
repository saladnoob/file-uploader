const uploadForm = document.getElementById('uploadForm');
const uploadStatus = document.getElementById('upload-status');

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission

  const formData = new FormData(uploadForm); // Create FormData object

  // Log the contents of the FormData object
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`${key}: ${value.name}, ${value.size} bytes, ${value.type}`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }

  try {
    const response = await fetch('/.netlify/functions/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('Fetch response:', response); // Log the entire response object
    console.log('Fetch response status:', response.status); // Log the status code

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
