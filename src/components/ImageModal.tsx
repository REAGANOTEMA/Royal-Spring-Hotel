import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageModalProps {
  image: {
    src: string;
    title: string;
    category: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  currentIndex: number;
  totalImages: number;
}

const ImageModal: React.FC<ImageModalProps> = ({ 
  image, 
  isOpen, 
  onClose, 
  onPrevious, 
  onNext, 
  currentIndex, 
  totalImages 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
      <div className="relative max-w-7xl max-h-[90vh] w-full flex flex-col">
        {/* Header with controls */}
        <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md">
          <button
            onClick={onPrevious}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          <div className="text-center flex-1">
            <h3 className="text-white font-bold text-lg">{image.title}</h3>
            <p className="text-white/80 text-sm">{image.category}</p>
          </div>
          
          <button
            onClick={onNext}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            disabled={currentIndex === totalImages - 1}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Main image */}
        <div className="flex-1 flex items-center justify-center p-4">
          <img
            src={image.src}
            alt={image.title}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
          <p className="text-white text-sm font-medium">
            {currentIndex + 1} / {totalImages}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
