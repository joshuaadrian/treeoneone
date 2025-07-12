function initFormHandler() {
    const form = document.getElementById('requestForm');
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const photoPreview = document.getElementById('photoPreview');
    const startCameraBtn = document.getElementById('startCamera');
    const capturePhotoBtn = document.getElementById('capturePhoto');
    const retakePhotoBtn = document.getElementById('retakePhoto');

    console.log('Elements found:', {
        form: !!form,
        video: !!video,
        canvas: !!canvas,
        photoPreview: !!photoPreview,
        startCameraBtn: !!startCameraBtn,
        capturePhotoBtn: !!capturePhotoBtn,
        retakePhotoBtn: !!retakePhotoBtn
    });

    // Check if required elements exist
    if (!form || !video || !canvas || !photoPreview || !startCameraBtn || !capturePhotoBtn || !retakePhotoBtn) {
        console.error('Required camera elements not found');
        return;
    }

    console.log('All required elements found, initializing camera functionality...');

    let stream = null;

    // Simple camera start function
    async function startCamera() {
        console.log('Starting camera...');
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            console.log('Camera stream obtained');
            
            video.srcObject = stream;
            video.style.display = 'block';
            startCameraBtn.style.display = 'none';
            capturePhotoBtn.style.display = 'block';
            console.log('Camera started successfully');
        } catch (err) {
            console.error('Error accessing camera:', err);
            alert('Could not access camera. Please ensure you have granted camera permissions.');
        }
    }

    // Start camera
    startCameraBtn.addEventListener('click', async () => {
        console.log('Start camera button clicked');
        await startCamera();
    });

    // Capture photo
    capturePhotoBtn.addEventListener('click', () => {
        console.log('Capture photo button clicked');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const photoData = canvas.toDataURL('image/jpeg');
        photoPreview.src = photoData;
        photoPreview.style.display = 'block';
        video.style.display = 'none';
        capturePhotoBtn.style.display = 'none';
        retakePhotoBtn.style.display = 'block';
        console.log('Photo captured');
    });

    // Retake photo
    retakePhotoBtn.addEventListener('click', () => {
        console.log('Retake photo button clicked');
        photoPreview.style.display = 'none';
        video.style.display = 'block';
        retakePhotoBtn.style.display = 'none';
        capturePhotoBtn.style.display = 'block';
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        console.log('Form submission started');
        e.preventDefault();

        const formData = {
            date: new Date().toISOString(),
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

    console.log('Form handler initialization complete');
}

initFormHandler();