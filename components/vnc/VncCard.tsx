'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useSpring } from 'framer-motion';
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
  
  // Touch interaction state
  const [isTouching, setIsTouching] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for touch-based tilt
  const touchRotateX = useMotionValue(0);
  const touchRotateY = useMotionValue(0);
  const springRotateX = useSpring(touchRotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(touchRotateY, { stiffness: 300, damping: 30 });

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
    if (!isExploded && !isTouching) {
      setIsFlipped(!isFlipped);
    }
  };
  
  // Touch handlers for mobile interactions
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsTouching(true);
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    touchStartTime.current = Date.now();
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!cardRef.current) return;
    
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate position relative to card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;
    
    // Convert to rotation angles (-15 to 15 degrees)
    const rotateY = (deltaX / rect.width) * 30;
    const rotateX = -(deltaY / rect.height) * 30;
    
    touchRotateX.set(rotateX);
    touchRotateY.set(rotateY);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsTouching(false);
    
    // Reset tilt
    touchRotateX.set(0);
    touchRotateY.set(0);
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    const deltaTime = Date.now() - touchStartTime.current;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;
    
    // Detect swipe gesture (fast horizontal movement)
    if (velocity > 0.5 && Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (!isExploded) {
        setIsFlipped(!isFlipped);
      }
    }
    // If it's a tap (no significant movement), treat as click
    else if (distance < 10 && deltaTime < 300) {
      handleCardClick();
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
    <div 
      ref={cardRef}
      className="relative w-[320px] h-[480px] perspective-1000 cursor-pointer group touch-none" 
      onClick={handleCardClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        className={cn(
          "w-full h-full relative preserve-3d",
          isFloating && "hover:scale-105"
        )}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        style={{
          rotateX: springRotateX,
          rotateZ: springRotateY,
        }}
        transition={{ 
          duration: 0.5, 
          type: "spring", 
          stiffness: 200, 
          damping: 25,
          mass: 0.8 // Lighter feel for smoother mobile performance
        }}
      >
        {/* FRONT FACE */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden will-change-transform group-hover:border-white/20 transition-colors duration-300">
          <HoloOverlay 
            x={x} 
            y={y} 
            isFlipped={isFlipped} 
            touchTiltX={springRotateX.get()} 
            touchTiltY={springRotateY.get()} 
          />
          
          {/* Enhanced glow on hover (desktop only) */}
          {isFloating && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
            </div>
          )}
          
          <div className="relative z-20 flex flex-col items-center justify-center h-full p-6 text-white space-y-6">
            <motion.div 
              className="w-32 h-32 rounded-full border-2 border-white/30 overflow-hidden shadow-lg relative group/avatar"
              variants={explosionVariants}
              custom={1}
              animate={controls}
              onClick={handleAvatarTap}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
               {/* Animated ring on hover */}
               <div className="absolute inset-0 rounded-full border-2 border-blue-400/0 group-hover/avatar:border-blue-400/50 transition-all duration-300 scale-105" />
               
               {/* Fallback avatar with gradient */}
               <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center text-3xl font-bold relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">{VNC_DATA.profile.name.charAt(0)}</span>
               </div>
               {/* <Image src={VNC_DATA.profile.avatar} alt="Avatar" fill className="object-cover" /> */}
            </motion.div>

            <div className="text-center space-y-2">
              <motion.h1 
                className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
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
              className="mt-8 flex flex-col items-center gap-2"
              variants={explosionVariants}
              custom={4}
              animate={controls}
            >
               <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/50">
                 TAP TO FLIP
               </div>
               <div className="text-[10px] text-white/30 uppercase tracking-wider">
                 or swipe horizontally
               </div>
            </motion.div>
          </div>
        </div>

        {/* BACK FACE */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden will-change-transform group-hover:border-white/20 transition-colors duration-300"
          style={{ transform: "rotateY(180deg)" }}
        >
          <HoloOverlay 
            x={x} 
            y={y} 
            isFlipped={isFlipped} 
            touchTiltX={springRotateX.get()} 
            touchTiltY={springRotateY.get()} 
          />
          
          {/* Enhanced glow on hover (desktop only) */}
          {isFloating && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10" />
            </div>
          )}
          
          <div className="relative z-20 flex flex-col items-center justify-center h-full p-8 text-white space-y-8">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-blue-400" />
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Connect</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-4 w-full">
              {VNC_DATA.profile.socials.map((social, index) => {
                const Icon = IconMap[social.icon] || Globe;
                return (
                  <motion.a 
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all gap-2 group/icon relative overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover/icon:opacity-100 transition-opacity">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/icon:translate-x-full transition-transform duration-700" />
                    </div>
                    <Icon className="w-6 h-6 text-white/70 group-hover/icon:text-white transition-colors relative z-10" />
                    <span className="text-[10px] uppercase tracking-wider text-white/40 group-hover/icon:text-white/60 transition-colors relative z-10">{social.label}</span>
                  </motion.a>
                );
              })}
            </div>

            <div className="flex flex-col w-full gap-3 mt-4">
              <motion.button 
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-blue-500/50 relative overflow-hidden group/btn"
                onClick={(e) => {
                  e.stopPropagation();
                  // Logic to download vCard would go here
                  alert("vCard Download Triggered");
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                </div>
                <UserPlus className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Add Contact</span>
              </motion.button>
              
              <motion.button 
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-all border border-white/20 hover:border-white/30 backdrop-blur-sm relative overflow-hidden group/btn"
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                </div>
                <Mail className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Copy Email</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
