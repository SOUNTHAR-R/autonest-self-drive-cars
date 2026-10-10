import React, { useState, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import { Sparkles, Move, Loader2 } from 'lucide-react';

interface SplineVehicleSceneProps {
  className?: string;
  height?: string;
  showControls?: boolean;
}

export const SplineVehicleScene: React.FC<SplineVehicleSceneProps> = ({
  className = '',
  height = 'h-[500px] md:h-[650px]',
  showControls = true
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLoad = (splineApp: any) => {
    setIsLoading(false);
    try {
      const container = containerRef.current;
      const canvas = container ? container.querySelector('canvas') : null;

      if (canvas) {
        canvas.style.touchAction = 'none';
        canvas.style.pointerEvents = 'auto';
      }

      if (splineApp) {
        const controls = splineApp._controls || splineApp.controls || splineApp._cameraControls;
        if (controls) {
          controls.enablePan = false;
          controls.enableRotate = true;
          controls.rotateSpeed = 0.8;
          controls.touches = { ONE: 0, TWO: 1 };
        }
      }
    } catch (err) {
      console.warn('Spline touch listener setup:', err);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#12141d] to-[#090a0f] border border-white/10 shadow-2xl ${height} ${className}`}
      style={{ touchAction: 'none' }}
    >
      
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#090a0f]/90 backdrop-blur-md space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#e63946]/10 border border-[#e63946]/30 flex items-center justify-center animate-pulse">
            <Loader2 className="w-6 h-6 text-[#e63946] animate-spin" />
          </div>
          <p className="text-xs font-bold text-white uppercase tracking-widest font-heading animate-pulse">
            Initializing 3D Vehicle Canvas...
          </p>
        </div>
      )}

      {/* Spline Canvas Container */}
      <div className="w-full h-full relative spline-canvas-container pointer-events-auto" style={{ touchAction: 'none' }}>
        <Spline
          scene="https://prod.spline.design/AQlN8q71T0ZzTqkz/scene.splinecode"
          onLoad={handleLoad}
          className="w-full h-full pointer-events-auto"
          style={{ touchAction: 'none', pointerEvents: 'auto' }}
        />
      </div>

      {/* Interactive Controls Overlay */}
      {showControls && !isLoading && (
        <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#090a0f]/80 backdrop-blur-md border border-white/10 text-white text-[11px] font-semibold pointer-events-auto">
            <Move className="w-3.5 h-3.5 text-[#e63946]" />
            <span>Interactive 3D Model • Touch & Drag to Rotate</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#090a0f]/80 backdrop-blur-md border border-white/10 text-zinc-300 text-[11px] font-semibold pointer-events-auto">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Real-time Raytracing Shader</span>
          </div>
        </div>
      )}

      {/* Top Badge */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <span className="px-3.5 py-1.5 rounded-full bg-[#e63946]/90 text-white text-xs font-extrabold uppercase tracking-widest font-heading shadow-lg shadow-[#e63946]/30 backdrop-blur-md">
          3D FLEET STUDIO
        </span>
      </div>

    </div>
  );
};
