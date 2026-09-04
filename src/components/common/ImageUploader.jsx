import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, Image as ImageIcon, AlertCircle, Camera } from 'lucide-react';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_FILES = 5;

export default function ImageUploader({ selectedFiles, setSelectedFiles }) {
  const [previews, setPreviews] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Sync object URLs for local previews & cleanup on unmount/removal
  useEffect(() => {
    const objectUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const validateAndAddFiles = (newFiles) => {
    setErrorMsg('');
    const incomingList = Array.from(newFiles);

    if (selectedFiles.length + incomingList.length > MAX_FILES) {
      setErrorMsg(`You can upload a maximum of ${MAX_FILES} photos.`);
      return;
    }

    const validFiles = [];
    for (const file of incomingList) {
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      const validExts = ['.jpg', '.jpeg', '.png', '.webp'];

      if (!ALLOWED_TYPES.includes(file.type) && !validExts.includes(ext)) {
        setErrorMsg('Only JPG, PNG and WEBP images are supported.');
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setErrorMsg(`Each image must be smaller than 5 MB. (${file.name} is too large)`);
        return;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index) => {
    setErrorMsg('');
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center">
            <Camera className="w-4 h-4 mr-2 text-blue-600" />
            Show the professional what's wrong
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Add up to 5 photos to help the professional understand the problem before arriving.
          </p>
        </div>
        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
          selectedFiles.length === MAX_FILES 
            ? 'bg-amber-50 text-amber-700 border-amber-200' 
            : 'bg-slate-100 text-slate-700 border-slate-200'
        }`}>
          {selectedFiles.length} / {MAX_FILES} photos
        </span>
      </div>

      {/* Drag & Drop Box */}
      {selectedFiles.length < MAX_FILES && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-600 bg-blue-50/80 scale-[1.01]'
              : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />

          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-blue-100 shadow-xs">
            <UploadCloud className="w-6 h-6" />
          </div>

          <p className="text-xs font-bold text-slate-800">
            Drop photos here or <span className="text-blue-600 underline">click to browse</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Supports JPG, PNG, WEBP (Max 5 MB each)
          </p>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span className="font-medium">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="font-bold text-red-700 ml-2">✕</button>
        </motion.div>
      )}

      {/* Previews Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-1">
          <AnimatePresence>
            {previews.map((src, index) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100"
              >
                <img
                  src={src}
                  alt={`Upload preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/80 hover:bg-red-600 text-white transition-colors shadow-md"
                  title="Remove photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
