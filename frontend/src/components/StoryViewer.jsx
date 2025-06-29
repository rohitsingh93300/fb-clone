import React, { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';

const StoryViewer = ({ stories, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Auto Next Logic
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setTimeout(() => {
        handleNext();
      }, 3000);
    }

    return () => clearTimeout(timerRef.current);
  }, [currentIndex, isPaused]);

  // Next Story
  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  // Previous Story
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Pause on Hold
  const handleMouseDown = () => {
    setIsPaused(true);
    clearTimeout(timerRef.current);
  };

  const handleMouseUp = () => {
    setIsPaused(false);
  };

  // Click to Next / Prev
  const handleClick = (e) => {
    const { clientX } = e;
    const middle = window.innerWidth / 2;
    if (clientX < middle) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  if (!stories[currentIndex]) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80  bg-opacity-50 flex items-center justify-center z-50"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
    >
      <div className="relative w-[500px] h-[700px]">
        {/* Story Image */}
        <img
          src={stories[currentIndex].imageUrl}
          alt="Story"
          className="w-full h-full object-cover rounded-lg"
        />

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded-full"
        >
          <X />
        </button>

        {/* Progress Bar */}
        <div className="absolute top-2 left-2 right-2 flex space-x-1">
          {stories.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-1 rounded-full ${
                index < currentIndex ? 'bg-white' : index === currentIndex ? 'bg-white animate-pulse' : 'bg-gray-500'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
