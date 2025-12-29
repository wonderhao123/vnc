'use client';

import { BentoGrid } from '@/components/bento/BentoGrid';
import { VncCard } from '@/components/vnc/VncCard';
import { useVncSensor } from '@/hooks/useVncSensor';
import { animated, to } from '@react-spring/web';

export default function Home() {
  const { x, y, values, requestAccess, isMobile, permissionGranted, needsPermission } = useVncSensor();

  return (
    <main className="bg-black text-white overflow-hidden font-sans selection:bg-pink-500/30">
      
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
        <div className="absolute bottom-12 left-0 w-full text-center text-white/30 text-xs pointer-events-none animate-pulse">
          {permissionGranted ? 'TILT DEVICE TO EXPLORE' : 'TAP TO ENABLE MOTION SENSORS'}
        </div>
      </div>

      {/* Desktop View: Dashboard */}
      <div className="hidden lg:flex w-full h-screen max-w-[1600px] mx-auto">
        
        {/* Left Column: Fixed Card */}
        <div className="w-[400px] h-full flex flex-col items-center justify-center relative z-20 p-8 border-r border-white/5 bg-black/50 backdrop-blur-sm">
          <div className="relative perspective-1000">
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
          
          <div className="mt-12 text-center space-y-2">
             <p className="text-xs font-mono text-white/40">VNC // VIRTUAL NAME CARD</p>
             <p className="text-[10px] text-white/20">EST. 2025</p>
          </div>
        </div>

        {/* Right Column: Bento Grid */}
        <div className="flex-1 h-full relative z-10 bg-gradient-to-br from-gray-900 to-black">
          {/* Background Mesh for Desktop */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_50%_50%,_rgba(0,112,243,0.2),_transparent_70%)]" />
             <div className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_50%_50%,_rgba(255,0,128,0.15),_transparent_70%)]" />
          </div>
          
          <BentoGrid />
        </div>
      </div>
    </main>
  );
}
