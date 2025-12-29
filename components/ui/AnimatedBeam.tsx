'use client';

import { motion } from 'framer-motion';

interface AnimatedBeamProps {
  className?: string;
  duration?: number;
}

export function AnimatedBeam({ className = '', duration = 3 }: AnimatedBeamProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden rounded-inherit ${className}`}>
      <motion.div
        className="absolute inset-[-100%] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}
