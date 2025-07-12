document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('requestForm');
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const photoPreview = document.getElementById('photoPreview');
    const startCameraBtn = document.getElementById('startCamera');
    const capturePhotoBtn = document.getElementById('capturePhoto');
    const retakePhotoBtn = document.getElementById('retakePhoto');
    const cameraSelection = document.getElementById('cameraSelection');
    const cameraSelect = document.getElementById('cameraSelect');
    const switchCameraBtn = document.getElementById('switchCamera');
    
    // Check if required elements exist
    if (!form || !video || !canvas || !photoPreview || !startCameraBtn || !capturePhotoBtn || !retakePhotoBtn) {
        console.error('Required camera elements not found');
        return;
    }
    
    let stream = null;
    let availableCameras = [];
    let currentCameraIndex = 0;

    // Get available cameras
    async function getAvailableCameras() {
        try {
            // Request camera permission first
            await navigator.mediaDevices.getUserMedia({ video: true });
            
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            availableCameras = videoDevices;
            
            // Only proceed if camera selection elements exist
            if (!cameraSelect) {
                console.warn('Camera select element not found');
                return;
            }
            
            // Clear existing options
            cameraSelect.innerHTML = '';
            
            if (videoDevices.length === 0) {
                cameraSelect.innerHTML = '<option value="">No cameras found</option>';
                return;
            }
            
            // Add camera options
            videoDevices.forEach((device, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = device.label || `Camera ${index + 1}`;
                cameraSelect.appendChild(option);
            });
            
            // Show camera selection if multiple cameras available and elements exist
            if (videoDevices.length > 1 && cameraSelection && switchCameraBtn) {
                cameraSelection.style.display = 'block';
                switchCameraBtn.style.display = 'inline-block';
            }
        } catch (err) {
            console.error('Error getting cameras:', err);
            if (cameraSelect) {
                cameraSelect.innerHTML = '<option value="">Error loading cameras</option>';
            }
        }
    }

    // Start camera with specific device
    async function startCameraWithDevice(deviceIndex = 0) {
        try {
            // Stop existing stream if any
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            if (availableCameras.length === 0) {
                // Fallback to default camera
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
            } else {
                // Use selected camera
                const deviceId = availableCameras[deviceIndex].deviceId;
                stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { deviceId: { exact: deviceId } }
                });
            }
            
            video.srcObject = stream;
            video.style.display = 'block';
            startCameraBtn.style.display = 'none';
            capturePhotoBtn.style.display = 'block';
            currentCameraIndex = deviceIndex;
        } catch (err) {
            console.error('Error accessing camera:', err);
            alert('Could not access camera. Please ensure you have granted camera permissions.');
        }
    }

    // Start camera
    startCameraBtn.addEventListener('click', async () => {
        await getAvailableCameras();
        await startCameraWithDevice(0);
    });

    // Switch camera (only if element exists)
    if (switchCameraBtn) {
        switchCameraBtn.addEventListener('click', async () => {
            if (availableCameras.length > 1) {
                const nextIndex = (currentCameraIndex + 1) % availableCameras.length;
                await startCameraWithDevice(nextIndex);
                if (cameraSelect) {
                    cameraSelect.value = nextIndex;
                }
            }
        });
    }

    // Camera selection change (only if element exists)
    if (cameraSelect) {
        cameraSelect.addEventListener('change', async () => {
            const selectedIndex = parseInt(cameraSelect.value);
            if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < availableCameras.length) {
                await startCameraWithDevice(selectedIndex);
            }
        });
    }

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
        retakePhotoBtn.style.display = 'block';
        if (cameraSelection) {
            cameraSelection.style.display = 'none';
        }
    });

    // Retake photo
    retakePhotoBtn.addEventListener('click', () => {
        photoPreview.style.display = 'none';
        video.style.display = 'block';
        retakePhotoBtn.style.display = 'none';
        capturePhotoBtn.style.display = 'block';
        if (availableCameras.length > 1 && cameraSelection) {
            cameraSelection.style.display = 'block';
        }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
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
                if (cameraSelection) {
                    cameraSelection.style.display = 'none';
                }
                if (switchCameraBtn) {
                    switchCameraBtn.style.display = 'none';
                }
            } else {
                throw new Error('Failed to save request');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form. Please try again.');
        }
    });
}); 