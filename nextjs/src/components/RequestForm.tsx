import { useState, useRef, useEffect } from 'react';

interface RequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CameraDevice {
  deviceId: string;
  label: string;
}

export default function RequestForm({ isOpen, onClose }: RequestFormProps) {
  const [formData, setFormData] = useState({
    address: '',
    description: '',
    photo: '',
  });
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<CameraDevice[]>([]);
  const [selectedCameraIndex, setSelectedCameraIndex] = useState(0);
  const [showCameraSelection, setShowCameraSelection] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Get available cameras
  const getAvailableCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(videoDevices);
      setShowCameraSelection(videoDevices.length > 1);
    } catch (err) {
      console.error('Error getting cameras:', err);
    }
  };

  const startCameraWithDevice = async (deviceIndex = 0) => {
    try {
      // Stop existing stream if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      let stream: MediaStream;
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
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        setSelectedCameraIndex(deviceIndex);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const startCamera = async () => {
    await getAvailableCameras();
    await startCameraWithDevice(0);
  };

  const switchCamera = async () => {
    if (availableCameras.length > 1) {
      const nextIndex = (selectedCameraIndex + 1) % availableCameras.length;
      await startCameraWithDevice(nextIndex);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const photoData = canvas.toDataURL('image/jpeg');
        setFormData(prev => ({ ...prev, photo: photoData }));
        stopCamera();
        setShowCameraSelection(false);
      }
    }
  };

  const handleCameraChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(e.target.value);
    if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < availableCameras.length) {
      await startCameraWithDevice(selectedIndex);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setFormData({ address: '', description: '', photo: '' });
        onClose();
      }
    } catch (err) {
      console.error('Error submitting request:', err);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setShowCameraSelection(false);
    }
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
          <h2 className="text-2xl font-bold mb-6">Submit a Request</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-400 focus:ring-pink-400"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-400 focus:ring-pink-400"
                rows={4}
                required
              />
            </div>

            <div className="space-y-4">
              {/* Camera Selection */}
              {showCameraSelection && (
                <div className="p-4 bg-gray-50 rounded-lg border-2 border-pink-400">
                  <label htmlFor="cameraSelect" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Camera
                  </label>
                  <select
                    id="cameraSelect"
                    value={selectedCameraIndex}
                    onChange={handleCameraChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-400 focus:ring-pink-400 mb-2"
                  >
                    {availableCameras.map((camera, index) => (
                      <option key={camera.deviceId} value={index}>
                        {camera.label || `Camera ${index + 1}`}
                      </option>
                    ))}
                  </select>
                  {availableCameras.length > 1 && (
                    <button
                      type="button"
                      onClick={switchCamera}
                      className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-400 hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400"
                    >
                      Switch Camera
                    </button>
                  )}
                </div>
              )}

              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`w-full rounded-lg ${isCameraActive ? 'block' : 'hidden'}`}
              />
              {!isCameraActive && !formData.photo && (
                <button
                  type="button"
                  onClick={startCamera}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-400 hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400"
                >
                  Start Camera
                </button>
              )}
              {isCameraActive && (
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-400 hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400"
                >
                  Capture Photo
                </button>
              )}
              {formData.photo && (
                <div className="relative">
                  <img src={formData.photo} alt="Preview" className="w-full rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, photo: '' }));
                      setShowCameraSelection(availableCameras.length > 1);
                    }}
                    className="absolute top-2 right-2 bg-white bg-opacity-75 rounded-full p-2 hover:bg-opacity-100"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-400 hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 