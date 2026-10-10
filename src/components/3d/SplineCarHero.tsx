import React, { useState, useRef, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import { Loader2, Move } from 'lucide-react';

interface SplineCarHeroProps {
  className?: string;
}

export const SplineCarHero: React.FC<SplineCarHeroProps> = ({ className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isTouchingRef = useRef<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = container.querySelector('canvas');
    if (!canvas) return;

    // Apply strict touch-action and pointer styling directly to WebGL canvas
    canvas.style.touchAction = 'none';
    canvas.style.pointerEvents = 'auto';

    const dispatchSyntheticPointerEvent = (type: string, touch: Touch, buttons: number) => {
      try {
        const pointerEvent = new PointerEvent(type, {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: touch.clientX,
          clientY: touch.clientY,
          screenX: touch.screenX,
          screenY: touch.screenY,
          pointerId: 1,
          pointerType: 'touch',
          isPrimary: true,
          buttons
        });
        canvas.dispatchEvent(pointerEvent);
      } catch (err) {
        // Fallback for older browsers
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isTouchingRef.current = true;
        dispatchSyntheticPointerEvent('pointerdown', e.touches[0], 1);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isTouchingRef.current) {
        e.preventDefault(); // Prevent browser native window scroll
        dispatchSyntheticPointerEvent('pointermove', e.touches[0], 1);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTouchingRef.current) {
        isTouchingRef.current = false;
        const lastTouch = e.changedTouches[0] || e.touches[0];
        if (lastTouch) {
          dispatchSyntheticPointerEvent('pointerup', lastTouch, 0);
        }
      }
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isLoading]);

  const handleSplineLoad = () => {
    setIsLoading(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center bg-transparent overflow-hidden pointer-events-auto spline-canvas-container z-30 ${className}`}
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

      {/* Mobile Interactive Hint Badge */}
      {!isLoading && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none sm:hidden">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#090a0f]/80 backdrop-blur-md border border-white/10 text-zinc-300 text-[10px] font-bold uppercase tracking-wider">
            <Move className="w-3 h-3 text-[#e63946]" />
            <span>Drag 1 Finger to Rotate 3D Porsche</span>
          </div>
        </div>
      )}

      {/* Transparent Spline Canvas Wrapper */}
      <div
        className="relative w-full h-[calc(100%+75px)] -mb-[75px] flex items-center justify-center bg-transparent origin-center spline-canvas-container pointer-events-auto z-30"
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
