import React, { useState, useEffect, useRef } from "react";
import {
  UploadCloud,
  Camera,
  Clipboard,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Download,
  Share2,
  X,
  AlertTriangle,
  ChevronLeft,
  ArrowRight,
  FileText
} from "lucide-react";
import Markdown from "react-markdown";
import { CameraCapture } from "./CameraCapture";
import { AnalysisItem } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface AnalyzerViewProps {
  onAnalysisSuccess: (item: AnalysisItem) => void;
  selectedHistoricalItem: AnalysisItem | null;
  onClearSelectedHistoricalItem: () => void;
  prepopulatedImage: string | null;
  onClearPrepopulatedImage: () => void;
}

export const AnalyzerView: React.FC<AnalyzerViewProps> = ({
  onAnalysisSuccess,
  selectedHistoricalItem,
  onClearSelectedHistoricalItem,
  prepopulatedImage,
  onClearPrepopulatedImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3D Perspective States
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    
    // Smooth 3D tilt calculations
    const tiltX = (y - centerY) / centerY * -12;
    const tiltY = (x - centerX) / centerX * 12;
    
    setRotateX(tiltX);
    setRotateY(tiltY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  // States
  const [base64Url, setBase64Url] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  
  // Micro-interactions copy & share triggers
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isShared, setIsShared] = useState<boolean>(false);

  // Floating thinking state strings
  const [thinkingStep, setThinkingStep] = useState<string>("Initializing secure ingestion pipeline...");

  const thinkingSteps = [
    "Establishing secure backend SSL channel...",
    "Scanning image formatting metadata...",
    "Validating secure sandbox limits...",
    "Reading color channels and visual structures...",
    "Parsing embedded alphanumeric layouts...",
    "Executing contextual visual explanation core...",
    "Structuring markdown response parameters..."
  ];

  // Rotate thinking steps for premium loading experience
  useEffect(() => {
    if (!isAnalyzing) return;
    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex = (stepIndex + 1) % thinkingSteps.length;
      setThinkingStep(thinkingSteps[stepIndex]);
    }, 1800);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Handle historic item selection
  useEffect(() => {
    if (selectedHistoricalItem) {
      setBase64Url(selectedHistoricalItem.image);
      setAnalysisResult(selectedHistoricalItem.result);
      setMimeType(selectedHistoricalItem.mimeType);
      setFileSize(selectedHistoricalItem.fileSize);
      setError(null);
    }
  }, [selectedHistoricalItem]);

  // Handle prepopulated sample image
  useEffect(() => {
    if (prepopulatedImage) {
      setBase64Url(prepopulatedImage);
      setMimeType("image/webp");
      setFileSize("1.4 MB");
      setAnalysisResult(null);
      setError(null);
      // Automatically trigger analysis
      triggerAnalysis(prepopulatedImage, "image/webp", "1.4 MB");
      onClearPrepopulatedImage();
    }
  }, [prepopulatedImage]);

  // Paste image handler (window listener)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isAnalyzing || analysisResult) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [isAnalyzing, analysisResult]);

  // File Processor
  const processFile = (file: File) => {
    setError(null);

    // Validate size (10MB limit)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError("Secure validation failed: File size exceeds the 10MB limit.");
      return;
    }

    // Validate format
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Secure validation failed: Unsupported format. Please select a JPEG, PNG, WEBP, or GIF.");
      return;
    }

    const sizeString = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    setFileSize(sizeString);
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setBase64Url(dataUrl);
      setAnalysisResult(null);
    };
    reader.onerror = () => {
      setError("Ingestion error: Failed to process the image file safely.");
    };
    reader.readAsDataURL(file);
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  // Execute Backend API Proxy Routing
  const triggerAnalysis = async (imgBase64: string, type: string, size: string) => {
    setIsAnalyzing(true);
    setError(null);
    setThinkingStep("Establishing secure backend SSL channel...");

    try {
      const response = await fetch("/api/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Url: imgBase64 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The AI model encountered an error analyzing your image.");
      }

      setAnalysisResult(data.result);

      // Save to local storage history
      const newHistoryItem: AnalysisItem = {
        id: Math.random().toString(36).substr(2, 9),
        image: imgBase64,
        result: data.result,
        timestamp: new Date().toISOString(),
        mimeType: type,
        fileSize: size,
      };

      onAnalysisSuccess(newHistoryItem);

    } catch (err: any) {
      console.error("API describe error:", err);
      setError(err.message || "A secure connection error occurred. Please verify your file and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Trigger analysis for manually selected files
  const handleStartAnalysis = () => {
    if (!base64Url) return;
    triggerAnalysis(base64Url, mimeType, fileSize);
  };

  const handleReset = () => {
    setBase64Url(null);
    setAnalysisResult(null);
    setError(null);
    setFileSize("");
    setMimeType("");
    onClearSelectedHistoricalItem();
  };

  // Clipboard Copier
  const handleCopy = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(analysisResult);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Client-side MD Download Report generator
  const handleDownload = () => {
    if (!analysisResult) return;
    const element = document.createElement("a");
    const headerPrefix = `=========================================
SNAPEXPLAIN AI - VISUAL REASONING SUMMARY
Generated: ${new Date().toLocaleString()}
Size: ${fileSize} | Format: ${mimeType}
=========================================\n\n`;

    const file = new Blob([headerPrefix + analysisResult], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `SnapExplaiN_Report_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Share link simulation
  const handleShare = () => {
    if (!analysisResult) return;
    const shareUrl = `${window.location.origin}?shared=true&id=${Math.random().toString(36).substr(2, 9)}`;
    navigator.clipboard.writeText(shareUrl);
    setIsShared(true);
    setTimeout(() => setIsShared(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center" id="analyzer-main-container">
      {/* Camera Capture Modal popup */}
      <AnimatePresence>
        {showCamera && (
          <CameraCapture
            onCapture={(capturedBase64) => {
              setBase64Url(capturedBase64);
              setMimeType("image/webp");
              setFileSize("1.1 MB");
              setAnalysisResult(null);
              setShowCamera(false);
              // Auto-trigger analysis for seamless camera snapshot experience
              triggerAnalysis(capturedBase64, "image/webp", "1.1 MB");
            }}
            onClose={() => setShowCamera(false)}
          />
        )}
      </AnimatePresence>

      <div className="w-full max-w-5xl mx-auto px-4 md:px-0">
        <AnimatePresence mode="wait">
          {/* STATE 1: Upload Dropzone Area */}
          {!base64Url && !isAnalyzing && (
            <motion.div
              key="uploader"
              initial={{ opacity: 0, y: 15 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: isHovered ? 1.018 : 1.0,
                boxShadow: isHovered 
                  ? "0 25px 50px -12px rgba(59, 130, 246, 0.25)" 
                  : "0 10px 30px -15px rgba(0, 0, 0, 0.1)",
              }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                perspective: 1200,
                rotateX: rotateX,
                rotateY: rotateY,
                transformStyle: "preserve-3d",
              }}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`w-full relative rounded-3xl border-2 border-dashed transition-colors duration-300 p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[380px] cursor-pointer ${
                isDragging
                  ? "border-blue-500 bg-blue-500/5 shadow-[0_0_40px_rgba(59,130,246,0.15)] dark:bg-blue-500/10"
                  : "border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/40 hover:border-blue-500/40 dark:hover:border-blue-400/40"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              id="upload-dropzone-box"
            >
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-blue-600 text-[11px] font-bold tracking-widest text-white uppercase shadow-lg shadow-blue-500/20 select-none z-10"
                style={{ transform: "translateZ(40px) translateX(-50%)" }}
              >
                Automatic Recognition Engine
              </div>

              {/* Glowing Background Glows */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/15 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none"></div>

              <div 
                className="p-5 rounded-3xl bg-gradient-to-b from-zinc-50 to-zinc-100/50 dark:from-zinc-900 dark:to-zinc-950/30 border border-zinc-200/60 dark:border-zinc-800/60 mb-6 relative shadow-md transition-all group-hover:scale-105 duration-300"
                style={{ transform: "translateZ(35px)" }}
              >
                <UploadCloud className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full" />
              </div>

              <h3 
                className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mb-2 select-none"
                style={{ transform: "translateZ(25px)" }}
              >
                Drag & drop your image here
              </h3>
              <p 
                className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed select-none"
                style={{ transform: "translateZ(15px)" }}
              >
                Supports documents, charts, warning lights, handwriting, medicine labels, or physical devices.
                Paste directly (<kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold">Ctrl+V</kbd>).
              </p>

              {/* Action Trigger Buttons */}
              <div 
                className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md relative z-20"
                style={{ transform: "translateZ(30px)" }}
                onClick={(e) => e.stopPropagation()} // Prevent double file picker triggers on button click
              >
                {/* File picker selection */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-6 py-3.5 bg-zinc-950 dark:bg-zinc-50 hover:bg-zinc-850 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                  id="select-file-btn"
                >
                  <span>Choose Image File</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>

                {/* Live Camera trigger */}
                <button
                  onClick={() => setShowCamera(true)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white/90 dark:bg-zinc-900/90 hover:bg-zinc-50 dark:hover:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-800 font-bold text-zinc-800 dark:text-zinc-200 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  id="use-camera-btn"
                >
                  <Camera className="w-4 h-4 text-blue-500" />
                  <span>Snap Live Photo</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleFileChange}
              />

              <div 
                className="mt-8 flex items-center gap-3 text-xs font-mono text-zinc-400 dark:text-zinc-500 border-t border-zinc-250/20 dark:border-zinc-800/60 pt-6 w-full max-w-lg justify-center select-none"
                style={{ transform: "translateZ(10px)" }}
              >
                <span className="flex items-center gap-1">
                  <Clipboard className="w-3.5 h-3.5 text-blue-400" />
                  <span>Clipboard listener on</span>
                </span>
                <span className="text-zinc-300 dark:text-zinc-800">|</span>
                <span>Max size: 10MB</span>
                <span className="text-zinc-300 dark:text-zinc-800">|</span>
                <span>Instant SSL Proxy</span>
              </div>
            </motion.div>
          )}

          {/* STATE 2: Custom Premium Loader (AI Thinking animation) */}
          {isAnalyzing && (
            <motion.div
              key="loader-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full flex flex-col items-center justify-center min-h-[380px] rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md p-8 md:p-12 relative overflow-hidden"
              id="thinking-loader-box"
            >
              {/* Scanning visual overlay */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" />

              <div className="relative mb-8 flex items-center justify-center">
                {/* Pulsing rings */}
                <div className="absolute w-24 h-24 bg-blue-500/10 dark:bg-blue-500/5 rounded-full animate-ping pointer-events-none" />
                <div className="absolute w-16 h-16 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full animate-pulse pointer-events-none" />

                {/* Animated tech spinner logo */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg relative z-10 animate-spin" style={{ animationDuration: "8s" }}>
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Analyzing your image...
              </h3>
              
              {/* Cycling detailed stage message */}
              <div className="px-5 py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-xs font-mono text-zinc-500 dark:text-zinc-400 font-medium animate-pulse max-w-sm text-center">
                {thinkingStep}
              </div>

              <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mt-8">
                Request proxy: Secured server-side SSL pipeline active
              </p>
            </motion.div>
          )}

          {/* STATE 3: Ready Image / Result Panel Split view */}
          {base64Url && !isAnalyzing && (
            <motion.div
              key="results-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col gap-6"
            >
              {/* Error overlay alert banner if any */}
              {error && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-800 dark:text-rose-200 text-sm flex items-start gap-3 shadow-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
                  <div className="flex-1">
                    <h4 className="font-bold">Execution Failed</h4>
                    <p className="text-xs text-rose-600 dark:text-rose-300 mt-1 leading-relaxed">{error}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={handleStartAnalysis}
                        className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-lg transition-all"
                      >
                        Retry Analysis
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-4 py-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold rounded-lg transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Main content grid panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Left Side: Uploaded Image Preview & quick stats */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="relative rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 shadow-md group">
                    <img
                      src={base64Url}
                      alt="Uploaded payload"
                      className="w-full h-auto object-contain max-h-[450px]"
                    />

                    {/* Meta tags details on preview image */}
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span>{mimeType.split("/")[1] || "Image"}</span>
                    </div>

                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                      {fileSize}
                    </div>

                    {/* Reset crosshair icon */}
                    {!analysisResult && (
                      <button
                        onClick={handleReset}
                        className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-black/70 hover:bg-black text-white transition-all shadow-md flex items-center gap-1 text-xs font-semibold"
                        title="Remove current image"
                      >
                        <X className="w-4 h-4" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>

                  {/* Trigger analysis button if only image is selected but not analyzed yet */}
                  {!analysisResult && !error && (
                    <button
                      onClick={handleStartAnalysis}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold tracking-wide shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      id="trigger-analysis-action-btn"
                    >
                      <Sparkles className="w-5 h-5 text-yellow-300" />
                      <span>Start Auto-Recognition Analysis</span>
                    </button>
                  )}

                  {analysisResult && (
                    <div className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 text-zinc-500 text-xs font-mono space-y-1.5 leading-relaxed">
                      <p className="font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                        Secure Proxy Telemetry
                      </p>
                      <p>Pipeline: Server-side SSL Tunnel</p>
                      <p>MIME Target: {mimeType}</p>
                      <p>Upload Size: {fileSize}</p>
                      <p>Model Action: Automatic Description</p>
                    </div>
                  )}
                </div>

                {/* Right Side: AI Explanations output */}
                <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-lg relative min-h-[400px]">
                  
                  {/* Result Header */}
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4 mb-6">
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors py-1.5 px-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Scan New Image</span>
                    </button>

                    {analysisResult && (
                      <div className="flex items-center gap-1.5">
                        {/* Copy button */}
                        <button
                          onClick={handleCopy}
                          className="p-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all relative group"
                          title="Copy explanation"
                          aria-label="Copy result"
                          id="copy-result-btn"
                        >
                          {isCopied ? <Check className="w-4.5 h-4.5 text-emerald-500" /> : <Copy className="w-4.5 h-4.5" />}
                          <span className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 px-2 py-1 text-[9px] font-bold bg-zinc-900 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm">
                            {isCopied ? "Copied!" : "Copy markdown"}
                          </span>
                        </button>

                        {/* Download button */}
                        <button
                          onClick={handleDownload}
                          className="p-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all relative group"
                          title="Download summary report"
                          aria-label="Download result"
                          id="download-result-btn"
                        >
                          <Download className="w-4.5 h-4.5" />
                          <span className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 px-2 py-1 text-[9px] font-bold bg-zinc-900 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm">
                            Download Report
                          </span>
                        </button>

                        {/* Share button */}
                        <button
                          onClick={handleShare}
                          className="p-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all relative group"
                          title="Share direct link"
                          aria-label="Share result"
                          id="share-result-btn"
                        >
                          {isShared ? <Check className="w-4.5 h-4.5 text-emerald-500" /> : <Share2 className="w-4.5 h-4.5" />}
                          <span className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 px-2 py-1 text-[9px] font-bold bg-zinc-900 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm">
                            {isShared ? "Link Copied!" : "Share Link"}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Render content */}
                  <div className="flex-1 overflow-y-auto max-h-[480px] pr-2">
                    {analysisResult ? (
                      <div className="markdown-body">
                        <Markdown
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-xl md:text-2xl font-bold text-zinc-950 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-4" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-6 mb-3" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-4 mb-2" {...props} />,
                            p: ({node, ...props}) => <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1.5 text-zinc-700 dark:text-zinc-300 text-sm" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1.5 text-zinc-700 dark:text-zinc-300 text-sm" {...props} />,
                            li: ({node, ...props}) => <li className="text-zinc-700 dark:text-zinc-300 leading-relaxed" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-semibold text-zinc-950 dark:text-white" {...props} />,
                            code: ({node, ...props}) => <code className="bg-zinc-100 dark:bg-zinc-900 text-blue-600 dark:text-blue-400 font-mono text-xs px-1.5 py-0.5 rounded-md" {...props} />,
                            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-zinc-500 dark:text-zinc-400 my-4" {...props} />,
                          }}
                        >
                          {analysisResult}
                        </Markdown>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400 py-12">
                        <div className="p-3.5 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 mb-4 animate-bounce">
                          <Sparkles className="w-6 h-6 text-blue-500" />
                        </div>
                        <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Awaiting Analysis execution</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mt-2 leading-relaxed">
                          Click the main trigger button below the image preview to execute the secure proxy.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions footer feedback link */}
                  <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between text-xs font-mono text-zinc-400 dark:text-zinc-500">
                    <span>Generated automatically via secure proxy</span>
                    <span>100% Client private sandboxed history</span>
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
