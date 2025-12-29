'use client';

import { useRef, useEffect, useState } from 'react';
import { useSpring, animated, to } from '@react-spring/web';
import { VncCard } from './VncCard';
import { useVncSensor } from '@/hooks/useVncSensor';

export function Lanyard() {
  const { x: sensorX, y: sensorY, values, requestAccess, isMobile, permissionGranted, needsPermission } = useVncSensor();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Physics state for the pendulum
  // We simulate the angle of the pendulum
  const [{ angle, xPos, yPos }, api] = useSpring(() => ({
    angle: 0,
    xPos: 0,
    yPos: 0,
    config: { mass: 10, tension: 40, friction: 20 } // Heavy pendulum feel
  }));

  useEffect(() => {
    // Map sensor tilt (values.x) to pendulum angle
    // If phone tilts left (negative x), pendulum swings right (positive angle) relative to gravity, 
    // but visually we want it to hang down.
    
    // Simplified: The card wants to stay at the bottom.
    // If device rotates, the "bottom" moves.
    
    // values.x is -1 to 1 (approx -45deg to 45deg)
    // We want the card to swing opposite to the tilt to stay vertical
    const targetAngle = values.x * -45; 
    
    api.start({ 
      angle: targetAngle,
      xPos: values.x * 20, // Slight parallax shift
      yPos: values.y * 20
    });
    
  }, [values, api]);

  // String geometry
  // Anchor is at top center of container
  // Card is at bottom of string
  
  return (
    <div ref={containerRef} className="relative w-full h-screen flex justify-center overflow-hidden bg-gray-900">
      {/* Background Mesh Gradient (Mobile) */}
      <div className="absolute inset-0 opacity-30">
         <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_50%_50%,_rgba(100,0,255,0.3),_transparent_70%)]" />
      </div>

      {/* The String (SVG) */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
        <animated.line
          x1="50%"
          y1="-20"
          x2="50%"
          y2="50%" // Approximate center of screen where card hangs
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
          style={{
            transformOrigin: '50% 0',
            transform: to([angle], (a) => `rotate(${a}deg)`),
          }}
        />
      </svg>

      {/* The Card Container */}
      <animated.div
        className="absolute top-[20%] z-20 touch-none"
        style={{
          transformOrigin: '50% -300px', // Pivot point way above the card
          transform: to([angle, xPos, yPos], (a, x, y) => `rotate(${a}deg) translate3d(${x}px, ${y}px, 0)`),
        }}
      >
        <VncCard x={sensorX} y={sensorY} />
      </animated.div>

      {/* Permission Request Button for Mobile */}
      {isMobile && needsPermission && !permissionGranted && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">Motion Sensors Required</h3>
            <p className="text-sm text-white/60">This experience uses your device orientation</p>
            <p className="text-xs text-white/40 mt-2">Note: Must be accessed via HTTPS</p>
          </div>
          <button 
            onClick={requestAccess}
            className="px-6 py-3 bg-white text-black font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            Enable Motion Sensors
          </button>
        </div>
      )}
    </div>
  );
}
