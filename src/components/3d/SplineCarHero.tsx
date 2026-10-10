import React, { useState, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import { Loader2 } from 'lucide-react';

interface SplineCarHeroProps {
  className?: string;
}

export const SplineCarHero: React.FC<SplineCarHeroProps> = ({ className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSplineLoad = () => {
    setIsLoading(false);

    // Access canvas element and attach non-passive touch event listeners for mobile touch rotation
    try {
      const container = containerRef.current;
      const canvas = container ? container.querySelector('canvas') : null;

      if (canvas) {
        canvas.style.touchAction = 'none';
        canvas.style.pointerEvents = 'auto';

        const handleTouchMove = (e: TouchEvent) => {
          // Prevent mobile browser window scroll when dragging finger over 3D car
          if (e.touches.length === 1) {
            e.preventDefault();
          }
        };

        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      }
    } catch (err) {
      console.warn('Spline touch listener setup:', err);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center bg-transparent overflow-hidden pointer-events-auto spline-canvas-container ${className}`}
      style={{ touchAction: 'none' }}
    >
      
      {/* Loader overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center space-y-3 pointer-events-none bg-transparent">
          <Loader2 className="w-8 h-8 text-[#e63946] animate-spin" />
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest font-heading">
            Loading Interactive Porsche 3D...
          </span>
        </div>
      )}

      {/* Transparent Spline Canvas Wrapper with Bottom Crop to erase Built with Spline watermark */}
      <div
        className="relative w-full h-[calc(100%+75px)] -mb-[75px] flex items-center justify-center bg-transparent origin-center spline-canvas-container pointer-events-auto"
        style={{ touchAction: 'none' }}
      >
        <Spline
          scene="https://prod.spline.design/AQlN8q71T0ZzTqkz/scene.splinecode"
          onLoad={handleSplineLoad}
          className="w-full h-full bg-transparent pointer-events-auto"
          style={{ touchAction: 'none', pointerEvents: 'auto' }}
        />
      </div>

    </div>
  );
};
