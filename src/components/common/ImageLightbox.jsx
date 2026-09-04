import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export default function ImageLightbox({ images = [], currentIndex = 0, isOpen, onClose, onNavigate }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const imageUrl = typeof currentImage === 'string' ? currentImage : currentImage?.url || '';

  const handlePrev = () => {
    if (images.length <= 1) return;
    const newIdx = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    onNavigate(newIdx);
  };

  const handleNext = () => {
    if (images.length <= 1) return;
    const newIdx = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    onNavigate(newIdx);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
        
        {/* Backdrop click listener */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Lightbox Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center space-y-4"
        >
          {/* Top Bar */}
          <div className="w-full flex items-center justify-between text-white px-2">
            <span className="text-xs font-mono font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {currentIndex + 1} / {images.length}
            </span>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Large Image */}
          <div className="relative flex items-center justify-center w-full h-[70vh]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`Problem photo ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            ) : (
              <div className="text-slate-400 text-xs">Image unavailable</div>
            )}

            {/* Previous Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 p-3 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white transition-all border border-white/20 shadow-xl active:scale-95"
                title="Previous photo (←)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 p-3 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white transition-all border border-white/20 shadow-xl active:scale-95"
                title="Next photo (→)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
