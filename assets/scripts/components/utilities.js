// Request button click handler
document.querySelector('.request--button')?.addEventListener('click', function(e) {
  e.preventDefault();
  document.body.classList.add('is-showing-form');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Form close button click handler
document.querySelector('.too--form--close')?.addEventListener('click', function(e) {
  e.preventDefault();
  
  // Stop camera stream if active
  const video = document.getElementById('video');
  if (video && video.srcObject) {
    const stream = video.srcObject;
    stream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  }
  
  // Reset camera UI
  const startCameraBtn = document.getElementById('startCamera');
  const capturePhotoBtn = document.getElementById('capturePhoto');
  const retakePhotoBtn = document.getElementById('retakePhoto');
  const photoPreview = document.getElementById('photoPreview');
  
  if (startCameraBtn) startCameraBtn.style.display = 'inline-block';
  if (capturePhotoBtn) capturePhotoBtn.style.display = 'none';
  if (retakePhotoBtn) retakePhotoBtn.style.display = 'none';
  if (photoPreview) photoPreview.style.display = 'none';
  if (video) video.style.display = 'none';
  
  document.body.classList.remove('is-showing-form');
});
