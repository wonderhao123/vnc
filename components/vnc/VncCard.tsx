'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { SpringValue } from '@react-spring/web';
import { VNC_DATA } from '@/lib/vnc-config';
import { HoloOverlay } from './HoloOverlay';
import { Github, Linkedin, Twitter, Mail, UserPlus, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VncCardProps {
  x: SpringValue<number>;
  y: SpringValue<number>;
  isFloating?: boolean; // For desktop mode
}

export function VncCard({ x, y, isFloating = false }: VncCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [isExploded, setIsExploded] = useState(false);
  const controls = useAnimation();

  // Easter Egg Logic
  useEffect(() => {
    if (tapCount >= 5) {
      triggerExplosion();
      setTapCount(0);
    }
    
    const timer = setTimeout(() => setTapCount(0), 2000); // Reset if not tapped fast enough
    return () => clearTimeout(timer);
  }, [tapCount]);

  const triggerExplosion = async () => {
    setIsExploded(true);
    // Deconstruct animation
    await controls.start("exploded");
    
    // Wait 5 seconds then snap back
    setTimeout(async () => {
      await controls.start("initial");
      setIsExploded(false);
    }, 5000);
  };

  const handleAvatarTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTapCount(prev => prev + 1);
  };

  const handleCardClick = () => {
    if (!isExploded) {
      setIsFlipped(!isFlipped);
    }
  };

  // Animation variants for explosion
  const explosionVariants = {
    initial: { x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 },
    exploded: (custom: number) => ({
      x: (Math.random() - 0.5) * 500,
      y: (Math.random() - 0.5) * 500,
      rotate: (Math.random() - 0.5) * 360,
      opacity: 0.8,
      scale: 0.5 + Math.random() * 0.5,
      transition: { duration: 1.5, type: "spring" as const }
    })
  };

  const IconMap: Record<string, any> = {
    Github, Linkedin, Twitter
  };

  return (
    <div className="relative w-[320px] h-[480px] perspective-1000 cursor-pointer group" onClick={handleCardClick}>
      <motion.div
        className={cn(
          "w-full h-full relative preserve-3d transition-all duration-500 ease-out-expo",
          isFloating && "hover:scale-105"
        )}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* FRONT FACE */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
          <HoloOverlay x={x} y={y} />
          
          <div className="relative z-20 flex flex-col items-center justify-center h-full p-6 text-white space-y-6">
            <motion.div 
              className="w-32 h-32 rounded-full border-2 border-white/30 overflow-hidden shadow-lg relative"
              variants={explosionVariants}
              custom={1}
              animate={controls}
              onClick={handleAvatarTap}
              whileTap={{ scale: 0.95 }}
            >
               {/* Fallback avatar if image fails or just a gradient placeholder */}
               <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-2xl font-bold">
                  {VNC_DATA.profile.name.charAt(0)}
               </div>
               {/* <Image src={VNC_DATA.profile.avatar} alt="Avatar" fill className="object-cover" /> */}
            </motion.div>

            <div className="text-center space-y-2">
              <motion.h1 
                className="text-3xl font-bold tracking-tight"
                variants={explosionVariants}
                custom={2}
                animate={controls}
              >
                {VNC_DATA.profile.name}
              </motion.h1>
              <motion.p 
                className="text-sm font-medium text-white/60 uppercase tracking-widest"
                variants={explosionVariants}
                custom={3}
                animate={controls}
              >
                {VNC_DATA.profile.role}
              </motion.p>
            </div>

            <motion.div 
              className="mt-8"
              variants={explosionVariants}
              custom={4}
              animate={controls}
            >
               <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/50">
                 TAP TO FLIP
               </div>
            </motion.div>
          </div>
        </div>

        {/* BACK FACE */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
          style={{ transform: "rotateY(180deg)" }}
        >
          <HoloOverlay x={x} y={y} />
          
          <div className="relative z-20 flex flex-col items-center justify-center h-full p-8 text-white space-y-8">
            <h2 className="text-xl font-bold mb-4">Connect</h2>
            
            <div className="grid grid-cols-3 gap-4 w-full">
              {VNC_DATA.profile.socials.map((social) => {
                const Icon = IconMap[social.icon] || Globe;
                return (
                  <a 
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors gap-2 group/icon"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Icon className="w-6 h-6 text-white/70 group-hover/icon:text-white transition-colors" />
                    <span className="text-[10px] uppercase tracking-wider text-white/40">{social.label}</span>
                  </a>
                );
              })}
            </div>

            <div className="flex flex-col w-full gap-3 mt-4">
              <button 
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-white text-black font-bold hover:bg-gray-200 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // Logic to download vCard would go here
                  alert("vCard Download Triggered");
                }}
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Contact</span>
              </button>
              
              <button 
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-colors border border-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  try {
                    const email = atob(VNC_DATA.profile.vCard.email);
                    navigator.clipboard.writeText(email);
                    alert("Email Copied: " + email);
                  } catch (err) {
                    console.error("Failed to decode email", err);
                  }
                }}
              >
                <Mail className="w-4 h-4" />
                <span>Copy Email</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
