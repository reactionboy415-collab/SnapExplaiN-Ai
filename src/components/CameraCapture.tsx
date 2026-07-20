import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CameraCaptureProps {
  onCapture: (base64Url: string) => void;
  onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Enumerate cameras
  useEffect(() => {
    async function getCameras() {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = mediaDevices.filter(device => device.kind === "videoinput");
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          // Default to environment (back) camera if available, otherwise first camera
          const backCam = videoDevices.find(d => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("environment"));
          setActiveDeviceId(backCam ? backCam.deviceId : videoDevices[0].deviceId);
        }
      } catch (err) {
        console.warn("Could not enumerate cameras", err);
      }
    }
    getCameras();
  }, []);

  // Initialize camera stream
  useEffect(() => {
    let active = true;
    async function initStream() {
      if (!activeDeviceId) return;
      setIsInitializing(true);
      setError(null);

      // Stop current stream if running
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      try {
        const constraints: MediaStreamConstraints = {
          video: {
            deviceId: { exact: activeDeviceId },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (active) {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setIsInitializing(false);
        } else {
          stream.getTracks().forEach(track => track.stop());
        }
      } catch (err: any) {
        console.error("Camera access error:", err);
        if (active) {
          // Fallback to non-exact constraint or any video camera
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
            setIsInitializing(false);
          } catch (fallbackErr: any) {
            setError(
              "Could not access camera. Please make sure camera permission is granted in your browser settings."
            );
            setIsInitializing(false);
          }
        }
      }
    }

    initStream();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeDeviceId]);

  const handleSwitchCamera = () => {
    if (devices.length <= 1) return;
    const currentIndex = devices.findIndex(d => d.deviceId === activeDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    setActiveDeviceId(devices[nextIndex].deviceId);
  };

  const handleCapture = () => {
    if (!videoRef.current || isInitializing) return;

    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      // Match high quality video feed size
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Extract high-quality WebP base64 image
        const dataUrl = canvas.toDataURL("image/webp", 0.9);
        onCapture(dataUrl);
      }
    } catch (err) {
      console.error("Failed to capture image", err);
      setError("An error occurred during capture. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      id="camera-capture-overlay"
    >
      <div className="relative w-full max-w-2xl overflow-hidden bg-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl flex flex-col h-[80vh] md:h-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-zinc-100">Live Camera Stream</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors rounded-lg hover:bg-zinc-800"
            aria-label="Close camera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px]">
          {isInitializing && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-zinc-400 z-10 bg-zinc-950">
              <div className="w-10 h-10 border-4 border-zinc-800 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm font-medium animate-pulse">Initializing camera stream...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-zinc-400 gap-4 bg-zinc-950 z-10">
              <AlertCircle className="w-12 h-12 text-rose-500" />
              <p className="max-w-md text-sm text-rose-200/90 leading-relaxed font-medium">{error}</p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-semibold rounded-xl transition-all"
              >
                Go Back
              </button>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover max-h-[60vh]"
          />

          {/* Scanner Guide Frame overlay */}
          {!error && !isInitializing && (
            <div className="absolute inset-0 border-[30px] border-black/40 pointer-events-none flex items-center justify-center">
              <div className="w-72 h-72 border-2 border-dashed border-blue-500/60 rounded-2xl relative shadow-[0_0_50px_rgba(59,130,246,0.15)]">
                {/* Scanner glowing reticles */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-md"></div>
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-md"></div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-md"></div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-md"></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        {!error && (
          <div className="p-6 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-around">
            {/* Switch Camera */}
            <button
              onClick={handleSwitchCamera}
              disabled={devices.length <= 1}
              className={`p-3 rounded-2xl border transition-all ${
                devices.length > 1
                  ? "border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800"
                  : "border-zinc-900 bg-zinc-950 text-zinc-600 cursor-not-allowed"
              }`}
              title="Switch camera device"
              aria-label="Switch camera"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {/* Snapshot Trigger button */}
            <button
              onClick={handleCapture}
              disabled={isInitializing}
              className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg active:scale-90 transition-all duration-150 relative group"
              title="Take analysis snapshot"
              aria-label="Capture snapshot"
            >
              <div className="absolute inset-1.5 border-2 border-white/60 rounded-full group-hover:border-white transition-colors" />
              <Camera className="w-7 h-7 relative" />
            </button>

            {/* Spacer/Placeholders for balance */}
            <div className="w-11" />
          </div>
        )}
      </div>
    </motion.div>
  );
};
