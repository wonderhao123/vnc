'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface GlowingCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowingCard({ 
  children, 
  className = '', 
  glowColor = 'rgba(100, 200, 255, 0.5)' 
}: GlowingCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Glow effect */}
      {isHovering && (
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 200,
            height: 200,
            left: mousePosition.x - 100,
            top: mousePosition.y - 100,
            background: `radial-gradient(circle, ${glowColor}, transparent 70%)`,
            filter: 'blur(30px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      
      {/* Border glow */}
      <div className="absolute inset-0 rounded-inherit">
        <div 
          className={`absolute inset-0 rounded-inherit transition-opacity duration-300 ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: `linear-gradient(to right, transparent, ${glowColor}, transparent)`,
            padding: '1px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      </div>
      
      {children}
    </motion.div>
  );
}
