import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Eye, ImageOff } from 'lucide-react';
import ImageLightbox from './ImageLightbox';

export default function ProblemPhotos({ images = [] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Safe Array Handling
  const safeImages = Array.isArray(images) ? images : [];

  if (safeImages.length === 0) {
    return (
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
          <Camera className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
          Problem Photos
        </h3>
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-slate-400 text-xs font-medium flex items-center space-x-2">
          <ImageOff className="w-4 h-4 text-slate-300" />
          <span>No photos were provided for this service request.</span>
        </div>
      </div>
    );
  }

  const openPhoto = (index) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
          <Camera className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
          Problem Photos ({safeImages.length})
        </h3>
        <span className="text-[11px] font-semibold text-slate-400">Click photo to expand</span>
      </div>

      {/* Thumbnails Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {safeImages.map((img, idx) => {
          const url = typeof img === 'string' ? img : img?.url || '';

          return (
            <motion.button
              key={img._id || idx}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => openPhoto(idx)}
              className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-xs group bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            >
              <img
                src={url}
                alt={`Problem photo ${idx + 1}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Eye className="w-5 h-5 drop-shadow-md" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <ImageLightbox
        images={safeImages}
        currentIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setSelectedIndex(newIdx)}
      />
    </div>
  );
}
