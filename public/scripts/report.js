document.getElementById('verifyButton').addEventListener('click', function() {
    const imageInput = document.getElementById('image');
    const warningMessage = document.getElementById('warningMessage'); // Fixing the reference
    const submitButton = document.getElementById('submitButton');
    // const personStatus = document.querySelector('input[name="personStatus"]:checked');
  
    // Clear the message first
    warningMessage.textContent = '';

    if (!imageInput.files[0]) {
        warningMessage.textContent = "⚠️ Select a valid image!";
        warningMessage.style.color = 'red';
      return;
    }

    // if (!personStatus) {
    //   warningMessage.textContent = "⚠️ Please select person status!";
    //   warningMessage.style.color = 'red';
    //   return; 
    // }

    verifyButton.disabled = true;
    verifyButton.textContent = "Verifying..."
  
    const formData = new FormData();
    formData.append('image', imageInput.files[0]);       // sending image and person status at backend for verification
    // formData.append('personStatus', personStatus.value);
  
    // Send image to server for verification
    fetch('/verify-image', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      if (data.verified) {
        verifyButton.textContent = "Verified";
        submitButton.disabled = false;  // Enable the submit button
      } else {
        warningMessage.textContent = "⚠️ Select a valid image!";
        verifyButton.textContent = "Verify Image"
        submitButton.disabled = true;   // Keep the submit button disabled
      }
      verifyButton.disabled = false;
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).render('500');
    });
  });
  