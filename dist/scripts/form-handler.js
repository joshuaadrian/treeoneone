document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('requestForm');
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const photoPreview = document.getElementById('photoPreview');
    const startCameraBtn = document.getElementById('startCamera');
    const capturePhotoBtn = document.getElementById('capturePhoto');
    const retakePhotoBtn = document.getElementById('retakePhoto');
    let stream = null;

    // Start camera
    startCameraBtn.addEventListener('click', async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.style.display = 'block';
            startCameraBtn.style.display = 'none';
            capturePhotoBtn.style.display = 'inline-block';
        } catch (err) {
            console.error('Error accessing camera:', err);
            alert('Could not access camera. Please ensure you have granted camera permissions.');
        }
    });

    // Capture photo
    capturePhotoBtn.addEventListener('click', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const photoData = canvas.toDataURL('image/jpeg');
        photoPreview.src = photoData;
        photoPreview.style.display = 'block';
        video.style.display = 'none';
        capturePhotoBtn.style.display = 'none';
        retakePhotoBtn.style.display = 'inline-block';
    });

    // Retake photo
    retakePhotoBtn.addEventListener('click', () => {
        photoPreview.style.display = 'none';
        video.style.display = 'block';
        retakePhotoBtn.style.display = 'none';
        capturePhotoBtn.style.display = 'inline-block';
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            date: document.getElementById('date').value,
            address: document.getElementById('address').value,
            author: document.getElementById('author').value,
            email: document.getElementById('email').value,
            description: document.getElementById('description').value,
            photo: photoPreview.style.display === 'block' ? photoPreview.src : null
        };

        try {
            // Stop camera stream if active
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            // Save to Cloudflare Pages Function
            const response = await fetch('/api/save-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Request submitted successfully!');
                form.reset();
                photoPreview.style.display = 'none';
                startCameraBtn.style.display = 'inline-block';
                retakePhotoBtn.style.display = 'none';
            } else {
                throw new Error('Failed to save request');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form. Please try again.');
        }
    });
}); 