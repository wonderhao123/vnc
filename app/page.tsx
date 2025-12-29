'use client';

import { BentoGrid } from '@/components/bento/BentoGrid';
import { VncCard } from '@/components/vnc/VncCard';
import { useVncSensor } from '@/hooks/useVncSensor';
import { animated, to } from '@react-spring/web';
import { Spotlight } from '@/components/ui/Spotlight';
import { GridBackground } from '@/components/ui/GridBackground';
import { FloatingOrbs } from '@/components/ui/FloatingOrbs';
import { StarField } from '@/components/ui/StarField';
import { FestivalEffects } from '@/components/ui/FestivalEffects';

export default function Home() {
  const { x, y, values, requestAccess, isMobile, permissionGranted, needsPermission } = useVncSensor();

  return (
    <main className="bg-black text-white overflow-hidden font-sans selection:bg-pink-500/30">
      {/* Festival Effects - Shows automatically based on date */}
      <FestivalEffects />
      
      {/* Mobile View: Centered Card with Tilt */}
      <div className="lg:hidden w-full fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="relative perspective-1000">
          <animated.div
            style={{
              transform: to([x, y], (xVal, yVal) => 
                `rotateX(${yVal * -20}deg) rotateY(${xVal * 20}deg)`
              )
            }}
          >
            <VncCard x={x} y={y} isFloating />
          </animated.div>
        </div>
        
        {/* Permission Request Button (iOS) */}
        {isMobile && needsPermission && !permissionGranted && (
          <button
            onClick={requestAccess}
            className="absolute bottom-24 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors shadow-lg"
          >
            Enable Device Motion
          </button>
        )}
        
        {/* Mobile Hint */}
        {/* <div className="absolute bottom-12 left-0 w-full text-center text-white/30 text-xs pointer-events-none animate-pulse">
          {permissionGranted ? 'TILT DEVICE TO EXPLORE' : 'TAP TO ENABLE MOTION SENSORS'}
        </div> */}
        <div className="mt-12 text-center space-y-3">
             <div className="flex items-center justify-center gap-2">
               <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
               <p className="text-xs font-mono text-white/40 uppercase tracking-wider">VNC // Virtual Name Card</p>
             </div>
             <p className="text-[10px] text-white/20 font-mono">Est. 2025 • Interactive Portfolio</p>
          </div>
      </div>

      {/* Desktop View: Dashboard */}
      <div className="hidden lg:flex w-full h-screen max-w-[1600px] mx-auto relative">
        {/* Background effects */}
        <StarField />
        <GridBackground />
        <FloatingOrbs />
        <Spotlight />
        
        {/* Left Column: Fixed Card */}
        <div className="w-[400px] h-full flex flex-col items-center justify-center relative z-20 p-8 border-r border-white/5 bg-black/30 backdrop-blur-sm">
          <div className="relative perspective-1000">
            {/* Glow effect behind card */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl scale-110 opacity-60 animate-pulse" />
            
            <animated.div
              style={{
                transform: to([x, y], (xVal, yVal) => 
                  `rotateX(${yVal * -10}deg) rotateY(${xVal * 10}deg)`
                )
              }}
            >
              <VncCard x={x} y={y} isFloating />
            </animated.div>
          </div>
          
          <div className="mt-12 text-center space-y-3">
             <div className="flex items-center justify-center gap-2">
               <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
               <p className="text-xs font-mono text-white/40 uppercase tracking-wider">VNC // Virtual Name Card</p>
             </div>
             <p className="text-[10px] text-white/20 font-mono">Est. 2025 • Interactive Portfolio</p>
          </div>
        </div>

        {/* Right Column: Bento Grid */}
        <div className="flex-1 h-full relative z-10">
          <BentoGrid />
        </div>
      </div>
    </main>
  );
}
