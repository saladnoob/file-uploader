const uploadForm = document.getElementById('uploadForm');
const uploadStatus = document.getElementById('upload-status');
const downloadForm = document.getElementById('downloadForm');
const downloadStatus = document.getElementById('download-status');
const mainHeading = document.getElementById('main-heading');

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(uploadForm);

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

    console.log('Fetch response:', response);
    console.log('Fetch response status:', response.status);

    if (!response.ok) {
      throw new Error(`Error uploading file: ${response.statusText} (Status Code: ${response.status})`);
    }

    const data = await response.json();
    console.log('Upload response data:', data);

    uploadStatus.textContent = data.message;
    if (data.message === 'File uploaded successfully!') {
      mainHeading.textContent = 'Download File';
      downloadForm.style.display = 'block';
      document.getElementById('filename').value = formData.get('file').name.replace(/[^\w.-]+/g, '_');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    uploadStatus.textContent = 'Error uploading file. Check the console for details.';
  }
});

downloadForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const filename = document.getElementById('filename').value;

  if (!filename) {
    downloadStatus.textContent = 'Filename is required';
    return;
  }

  try {
    const response = await fetch(`/.netlify/functions/download?filename=${filename}`);

    console.log('Fetch response:', response);
    console.log('Fetch response status:', response.status);

    if (!response.ok) {
      throw new Error(`Error downloading file: ${response.statusText} (Status Code: ${response.status})`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    downloadStatus.textContent = 'File downloaded successfully!';
  } catch (error) {
    console.error('Error downloading file:', error);
    downloadStatus.textContent = 'Error downloading file. Check the console for details.';
  }
});
