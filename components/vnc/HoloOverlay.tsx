'use client';

import { animated, SpringValue, to } from '@react-spring/web';
import { VNC_DATA } from '@/lib/vnc-config';

interface HoloOverlayProps {
  x: SpringValue<number>;
  y: SpringValue<number>;
}

export function HoloOverlay({ x, y }: HoloOverlayProps) {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none rounded-xl overflow-hidden">
      {/* Noise Texture */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }}
      />
      
      {/* Holographic Gradient */}
      <animated.div 
        className="absolute inset-0 mix-blend-color-dodge opacity-60"
        style={{
          background: VNC_DATA.theme.primaryHolo,
          backgroundSize: '200% 200%',
          backgroundPosition: to([x, y], (xVal, yVal) => `${50 + xVal * 50}% ${50 + yVal * 50}%`),
          filter: 'brightness(1.2) contrast(1.2)',
        }}
      />

      {/* Specular Highlight / Glare */}
      <animated.div
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-30 mix-blend-overlay"
        style={{
          transform: x.to(val => `translateX(${val * 100}%)`),
        }}
      />
      
      {/* Border Glow */}
      <div className="absolute inset-0 rounded-xl border border-white/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]" />
    </div>
  );
}
