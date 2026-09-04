import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating, reviewsCount, showText = true }) {
  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center text-amber-400">
        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
      </div>
      <span className="font-semibold text-slate-800 text-sm">{rating}</span>
      {showText && reviewsCount !== undefined && (
        <span className="text-slate-500 text-xs">({reviewsCount} reviews)</span>
      )}
    </div>
  );
}
