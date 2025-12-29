import { useEffect, useState } from 'react';
import { useSpring } from '@react-spring/web';

interface SensorValues {
  x: number; // -1 to 1
  y: number; // -1 to 1
  tiltX: number; // For 3D rotation
  tiltY: number;
}

export function useVncSensor() {
  const [values, setValues] = useState<SensorValues>({ x: 0, y: 0, tiltX: 0, tiltY: 0 });

  // Use spring for smoothing
  const [{ x, y }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    config: { mass: 1, tension: 120, friction: 14 }, // Smooth but responsive
  }));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xVal = (e.clientX / innerWidth) * 2 - 1;
      const yVal = (e.clientY / innerHeight) * 2 - 1;
      
      api.start({ x: xVal, y: yVal });
      setValues({ 
        x: xVal, 
        y: yVal,
        tiltX: yVal * 15, // Max 15 deg tilt
        tiltY: xVal * -15 
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [api]);

  return { x, y, values };
}
