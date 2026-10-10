import React, { useState, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import { Loader2, Move } from 'lucide-react';

interface SplineCarHeroProps {
  className?: string;
}

export const SplineCarHero: React.FC<SplineCarHeroProps> = ({ className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSplineLoad = (splineApp: any) => {
    setIsLoading(false);

    try {
      // 1. Target WebGL canvas element and set strict touchAction = 'none'
      const container = containerRef.current;
      const canvas = container ? container.querySelector('canvas') : null;

      if (canvas) {
        canvas.style.touchAction = 'none';
        canvas.style.pointerEvents = 'auto';
      }

      // 2. Configure Spline Orbit Controls: Enable Rotate & Disable Pan so touch drag rotates the 3D Porsche
      if (splineApp) {
        // Search controls or camera on splineApp instance
        const controls = splineApp._controls || splineApp.controls || splineApp._cameraControls;
        if (controls) {
          controls.enablePan = false; // Disable pan/drag shift
          controls.enableRotate = true; // Force orbit camera rotation
          controls.enableZoom = true;
          controls.rotateSpeed = 0.8;
          controls.touches = {
            ONE: 0, // 0 = TOUCH_ROTATE in Three.js OrbitControls!
            TWO: 1  // 1 = TOUCH_DOLLY_PAN
          };
        }
      }
    } catch (err) {
      console.warn('Spline controls configuration:', err);
    }
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

      {/* Transparent Spline Canvas Wrapper with Bottom Crop to erase Built with Spline watermark */}
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
