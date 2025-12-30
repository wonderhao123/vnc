'use client';

import { useEffect, useState } from 'react';
import { animated, SpringValue, to } from '@react-spring/web';

interface HoloOverlayProps {
  x: SpringValue<number>;
  y: SpringValue<number>;
  isFlipped?: boolean;
  touchTiltX?: number;
  touchTiltY?: number;
}

export function HoloOverlay({ x, y, isFlipped = false, touchTiltX = 0, touchTiltY = 0 }: HoloOverlayProps) {
  // Attempt to use the public `logo.svg` if available. If loading fails,
  // fall back to a small inline dot-pattern to avoid runtime 404 noise.
  const [logoPattern, setLogoPattern] = useState<string>('/logo.svg');

  useEffect(() => {
    let mounted = true;
    const img = new Image();
    img.src = '/logo.svg';
    img.onload = () => {
      if (mounted) setLogoPattern('/logo.svg');
    };
    img.onerror = () => {
      if (!mounted) return;
      // fallback inline SVG data URI (small dot pattern)
      setLogoPattern('data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Ccircle cx="10" cy="10" r="2" fill="%23ffffff" opacity="0.3"/%3E%3C/svg%3E');
    };

    return () => { mounted = false; };
  }, []);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none rounded-xl overflow-hidden">
      {/* Deep Blue Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900/40 to-black/60 mix-blend-multiply" />

      {/* Repeated Logo Pattern - Holographic Layer 1 (Depth) */}
      <animated.div 
        className="absolute inset-[-50%] w-[200%] h-[200%] opacity-25 mix-blend-color-dodge"
        style={{
          backgroundImage: `url("${logoPattern}")`,
          backgroundSize: '120px 120px',
          transform: to([x, y], (xVal, yVal) => 
            `translate(${xVal * 30}px, ${yVal * 30}px) rotate(-10deg)`
          ),
        }}
      />

      {/* Repeated Logo Pattern - Holographic Layer 2 (Parallax) */}
      <animated.div 
        className="absolute inset-[-50%] w-[200%] h-[200%] opacity-15 mix-blend-overlay"
        style={{
          backgroundImage: `url("${logoPattern}")`,
          backgroundSize: '120px 120px',
          backgroundPosition: '60px 60px',
          transform: to([x, y], (xVal, yVal) => 
            `translate(${xVal * 60}px, ${yVal * 60}px) rotate(-10deg)`
          ),
        }}
      />
      
      {/* Holographic Gradient / Iridescence - Enhanced during flip */}
      <animated.div 
        className="absolute inset-0 mix-blend-color-dodge transition-opacity duration-300"
        style={{
          opacity: isFlipped ? 0.7 : 0.5,
          background: 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(100,200,255,0.3) 20%, rgba(255,100,200,0.3) 40%, rgba(100,255,200,0.3) 60%, rgba(255,200,100,0.3) 80%, rgba(255,255,255,0) 100%)',
          backgroundSize: '300% 300%',
          backgroundPosition: to([x, y], (xVal, yVal) => {
            // Add touch tilt influence for mobile
            const effectiveX = xVal + (touchTiltY / 30);
            const effectiveY = yVal + (touchTiltX / 30);
            return `${50 + effectiveX * 100}% ${50 + effectiveY * 100}%`;
          }),
          filter: isFlipped ? 'brightness(1.4) contrast(1.3)' : 'brightness(1.2) contrast(1.2)',
        }}
      />

      {/* Specular Highlight / Glare - Stronger during tilt */}
      <animated.div
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent"
        style={{
          opacity: x.to(val => Math.abs(val) * 0.5), // Stronger visibility when tilted
          transform: x.to(val => `translateX(${val * 120}%) skewX(-20deg)`),
        }}
      />
      
      {/* Border Glow - Brighter during flip */}
      <div 
        className={`absolute inset-0 rounded-xl border transition-all duration-300 ${
          isFlipped 
            ? 'border-white/20 shadow-[inset_0_0_40px_rgba(100,200,255,0.2)]' 
            : 'border-white/10 shadow-[inset_0_0_30px_rgba(100,200,255,0.1)]'
        }`} 
      />
    </div>
  );
}
