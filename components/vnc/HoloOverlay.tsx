'use client';

import { animated, SpringValue, to } from '@react-spring/web';
import { VNC_DATA } from '@/lib/vnc-config';

interface HoloOverlayProps {
  x: SpringValue<number>;
  y: SpringValue<number>;
}

export function HoloOverlay({ x, y }: HoloOverlayProps) {
  // Simple geometric logo for the pattern (a stylized 'V' shape)
  const logoPattern = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 50 L10 10 L20 10 L30 35 L40 10 L50 10 Z' fill='white' fill-opacity='0.4'/%3E%3C/svg%3E`;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none rounded-xl overflow-hidden">
      {/* Deep Blue Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900/40 to-black/60 mix-blend-multiply" />

      {/* Repeated Logo Pattern - Holographic Layer 1 (Depth) */}
      <animated.div 
        className="absolute inset-[-50%] w-[200%] h-[200%] opacity-30 mix-blend-color-dodge"
        style={{
          backgroundImage: `url("${logoPattern}")`,
          backgroundSize: '60px 60px',
          transform: to([x, y], (xVal, yVal) => 
            `translate(${xVal * 30}px, ${yVal * 30}px) rotate(-10deg)`
          ),
        }}
      />

      {/* Repeated Logo Pattern - Holographic Layer 2 (Parallax) */}
      <animated.div 
        className="absolute inset-[-50%] w-[200%] h-[200%] opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("${logoPattern}")`,
          backgroundSize: '60px 60px',
          backgroundPosition: '30px 30px', // Offset
          transform: to([x, y], (xVal, yVal) => 
            `translate(${xVal * 60}px, ${yVal * 60}px) rotate(-10deg)`
          ),
        }}
      />
      
      {/* Holographic Gradient / Iridescence */}
      <animated.div 
        className="absolute inset-0 mix-blend-color-dodge opacity-50"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(100,200,255,0.2) 40%, rgba(255,100,200,0.2) 60%, rgba(255,255,255,0) 100%)',
          backgroundSize: '200% 200%',
          backgroundPosition: to([x, y], (xVal, yVal) => `${50 + xVal * 80}% ${50 + yVal * 80}%`),
          filter: 'brightness(1.2) contrast(1.2)',
        }}
      />

      {/* Specular Highlight / Glare */}
      <animated.div
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0"
        style={{
          opacity: x.to(val => Math.abs(val) * 0.4), // Only visible when tilted
          transform: x.to(val => `translateX(${val * 100}%) skewX(-20deg)`),
        }}
      />
      
      {/* Border Glow */}
      <div className="absolute inset-0 rounded-xl border border-white/10 shadow-[inset_0_0_30px_rgba(100,200,255,0.1)]" />
    </div>
  );
}
