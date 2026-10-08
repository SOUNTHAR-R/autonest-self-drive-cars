import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';
import { Loader2 } from 'lucide-react';

interface SplineCarHeroProps {
  className?: string;
}

export const SplineCarHero: React.FC<SplineCarHeroProps> = ({ className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative w-full h-full flex items-center justify-center bg-transparent overflow-hidden pointer-events-auto ${className}`}>
      
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
      <div className="relative w-full h-[calc(100%+75px)] -mb-[75px] flex items-center justify-center bg-transparent scale-[1.05] origin-center">
        <Spline
          scene="https://prod.spline.design/AQlN8q71T0ZzTqkz/scene.splinecode"
          onLoad={() => setIsLoading(false)}
          className="w-full h-full bg-transparent"
        />
      </div>

    </div>
  );
};
