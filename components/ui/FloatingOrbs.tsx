'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function FloatingOrbs() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const orbs = [
    { size: 400, color: 'rgba(100, 200, 255, 0.15)', duration: 20, delay: 0, initialX: 45, initialY: 30 },
    { size: 300, color: 'rgba(255, 100, 200, 0.12)', duration: 25, delay: 5, initialX: 70, initialY: 60 },
    { size: 350, color: 'rgba(100, 255, 200, 0.1)', duration: 22, delay: 10, initialX: 20, initialY: 80 },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            filter: 'blur(60px)',
          }}
          animate={{
            x: ['0%', '100%', '0%'],
            y: ['0%', '100%', '0%'],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          initial={{
            x: `${orb.initialX}%`,
            y: `${orb.initialY}%`,
          }}
        />
      ))}
    </div>
  );
}
