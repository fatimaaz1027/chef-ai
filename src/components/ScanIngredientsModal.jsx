import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Camera, Sparkles, Plus, Trash2, CheckSquare, Square, AlertCircle, RefreshCw } from 'lucide-react';
import { detectIngredientsFromImage } from '../services/imageDetector';

export default function ScanIngredientsModal({ isOpen, onClose, onSubmitQuery }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedIngredients, setDetectedIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const stopCameraTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraActive]);

  useEffect(() => {
    return () => {
      stopCameraTracks();
    };
  }, []);

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleCloseModal = () => {
    stopCameraTracks();
    onClose();
  };

  const handleImageSelected = (file) => {
    if (!file) return;
    setSelectedImage(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setDetectedIngredients([]);
    setToastMessage('');
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl('');
    setDetectedIngredients([]);
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      } else {
        showToast('Camera access is not supported on this browser. Please upload an image instead.');
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (err) {
      console.error('Camera access error:', err);
      stopCameraTracks();
      showToast('Camera permission was denied. Please allow camera access or upload an image instead.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'captured_ingredient.jpg', { type: 'image/jpeg' });
        stopCameraTracks();
        handleImageSelected(file);
      }
    }, 'image/jpeg', 0.9);
  };

  const handleDetect = async () => {
    if (!selectedImage) {
      showToast('Please upload an ingredient image first.');
      return;
    }

    setIsDetecting(true);
    try {
      const items = await detectIngredientsFromImage(selectedImage);
      setDetectedIngredients(
        items.map((name) => ({ name, selected: true }))
      );
    } catch (err) {
      showToast('Failed to detect ingredients. Please try adding them manually.');
    } finally {
      setIsDetecting(false);
    }
  };

  const toggleIngredient = (idx) => {
    setDetectedIngredients((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, selected: !item.selected } : item))
    );
  };

  const removeIngredient = (idx) => {
    setDetectedIngredients((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddManualIngredient = (e) => {
    e.preventDefault();
    if (!newIngredient.trim()) return;
    setDetectedIngredients((prev) => [
      ...prev,
      { name: newIngredient.trim(), selected: true }
    ]);
    setNewIngredient('');
  };

  const handleFindRecipes = () => {
    const selected = detectedIngredients
      .filter((item) => item.selected)
      .map((item) => item.name);

    if (selected.length === 0) {
      showToast('Please select ingredients first.');
      return;
    }

    const query = `I have ${selected.join(', ')}. What can I make with these ingredients?`;
    onSubmitQuery(query);
    handleCloseModal();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      onClick={handleCloseModal}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-[92vw] sm:w-full p-4 sm:p-6 shadow-2xl border border-gray-100 dark:border-slate-700/80 transition-colors max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📷</span>
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base sm:text-lg tracking-tight">
                Scan Ingredients
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload a photo to detect ingredients & find recipes
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400 min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageSelected(e.target.files[0])}
        />
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleImageSelected(e.target.files[0])}
        />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="mt-3 p-2.5 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Camera Viewfinder View */}
        {isCameraActive ? (
          <div className="mt-4 relative rounded-2xl overflow-hidden bg-black border border-gray-800 flex flex-col items-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-56 sm:h-64 object-cover"
            />
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-3 px-4">
              <button
                type="button"
                onClick={capturePhoto}
                className="py-2.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 transition active:scale-95 min-h-[40px]"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Photo</span>
              </button>
              <button
                type="button"
                onClick={stopCameraTracks}
                className="py-2.5 px-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition min-h-[40px]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* Image Selection / Preview Section */
          <div className="mt-4">
            {!selectedImage ? (
              <div className="space-y-3">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl p-6 text-center cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition flex flex-col items-center justify-center gap-2"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                    Upload Ingredient Image
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Take a photo or upload a picture of your ingredients
                  </span>
                </div>

                <button
                  type="button"
                  onClick={startCamera}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/60 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 transition flex items-center justify-center gap-2 min-h-[42px]"
                >
                  <Camera className="w-4 h-4 text-emerald-500" />
                  <span>Use Camera</span>
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-2xl p-3 border border-gray-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={imagePreviewUrl}
                    alt="Ingredient Preview"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-gray-200 dark:border-slate-600 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                      {selectedImage.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {(selectedImage.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-gray-200/60 dark:border-slate-600/60">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition flex items-center justify-center gap-1.5 min-h-[36px]"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Change Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="py-1.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 text-xs font-semibold text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition flex items-center justify-center gap-1.5 min-h-[36px]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Primary Detect Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleDetect}
            disabled={isDetecting || isCameraActive}
            className="w-full py-3 px-4 rounded-2xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 shadow-md hover:shadow-lg active:scale-95 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 min-h-[44px]"
          >
            {isDetecting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Detecting ingredients...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Detect Ingredients</span>
              </>
            )}
          </button>
        </div>

        {/* Detected Ingredients List Section */}
        {detectedIngredients.length > 0 && (
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-700 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm">
                Detected Ingredients
              </h4>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {detectedIngredients.filter((i) => i.selected).length} selected
              </span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {detectedIngredients.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs sm:text-sm transition ${
                    item.selected
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-100'
                      : 'bg-gray-50 dark:bg-slate-700/40 border-gray-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 opacity-60'
                  }`}
                >
                  <div
                    onClick={() => toggleIngredient(idx)}
                    className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                  >
                    {item.selected ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                    <span className="font-semibold truncate">{item.name}</span>
                  </div>
                  <button
                    onClick={() => removeIngredient(idx)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition rounded-lg"
                    aria-label="Remove ingredient"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Manual Ingredient */}
            <form onSubmit={handleAddManualIngredient} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="Add ingredient..."
                className="flex-1 px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-700/60 border border-gray-200 dark:border-slate-600 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500 transition"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 transition flex items-center gap-1 min-h-[36px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>

            {/* Find Recipes Action */}
            <button
              type="button"
              onClick={handleFindRecipes}
              className="w-full mt-2 py-3 px-4 rounded-2xl font-bold text-white bg-slate-900 dark:bg-emerald-500 hover:bg-slate-800 dark:hover:bg-emerald-600 shadow-md hover:shadow-lg active:scale-95 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Find Recipes</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
