import React, { useState, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import { Loader2 } from 'lucide-react';

interface SplineCarHeroProps {
  className?: string;
}

export const SplineCarHero: React.FC<SplineCarHeroProps> = ({ className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSplineLoad = (splineApp: any) => {
    setIsLoading(false);

    try {
      // Configure OrbitControls touch mapping if exposed by Spline runtime
      if (splineApp) {
        if (splineApp._controls) {
          splineApp._controls.touches = { ONE: 0, TWO: 1 };
        }
        if (splineApp.controls) {
          splineApp.controls.touches = { ONE: 0, TWO: 1 };
        }
      }

      const container = containerRef.current;
      const canvas = container ? container.querySelector('canvas') : null;

      if (canvas) {
        canvas.style.touchAction = 'none';
        canvas.style.pointerEvents = 'auto';

        let isTouchDragging = false;

        const handleTouchStart = (e: TouchEvent) => {
          if (e.touches.length === 1) {
            isTouchDragging = true;
            const touch = e.touches[0];
            try {
              const pointerEvent = new PointerEvent('pointerdown', {
                bubbles: true,
                cancelable: true,
                pointerId: 1,
                pointerType: 'mouse',
                isPrimary: true,
                clientX: touch.clientX,
                clientY: touch.clientY,
                screenX: touch.screenX,
                screenY: touch.screenY,
                button: 0,
                buttons: 1
              });
              canvas.dispatchEvent(pointerEvent);
            } catch (err) {
              // fallback for older browsers
            }
          }
        };

        const handleTouchMove = (e: TouchEvent) => {
          if (e.touches.length === 1) {
            e.preventDefault();
            const touch = e.touches[0];
            try {
              const pointerEvent = new PointerEvent('pointermove', {
                bubbles: true,
                cancelable: true,
                pointerId: 1,
                pointerType: 'mouse',
                isPrimary: true,
                clientX: touch.clientX,
                clientY: touch.clientY,
                screenX: touch.screenX,
                screenY: touch.screenY,
                button: 0,
                buttons: 1
              });
              canvas.dispatchEvent(pointerEvent);
            } catch (err) {
              // fallback
            }
          }
        };

        const handleTouchEnd = () => {
          if (isTouchDragging) {
            isTouchDragging = false;
            try {
              const pointerEvent = new PointerEvent('pointerup', {
                bubbles: true,
                cancelable: true,
                pointerId: 1,
                pointerType: 'mouse',
                isPrimary: true,
                button: 0,
                buttons: 0
              });
              canvas.dispatchEvent(pointerEvent);
            } catch (err) {
              // fallback
            }
          }
        };

        canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd, { passive: true });
        canvas.addEventListener('touchcancel', handleTouchEnd, { passive: true });
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
