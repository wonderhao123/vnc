import { useEffect, useState, useCallback } from 'react';
import { useSpring } from '@react-spring/web';

interface SensorValues {
  x: number; // -1 to 1
  y: number; // -1 to 1
  tiltX: number; // For 3D rotation
  tiltY: number;
}

export function useVncSensor() {
  const [values, setValues] = useState<SensorValues>({ x: 0, y: 0, tiltX: 0, tiltY: 0 });
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);

  // Use spring for smoothing
  const [{ x, y }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    config: { mass: 1, tension: 120, friction: 14 }, // Smooth but responsive
  }));

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (e.gamma === null || e.beta === null) {
      console.log('Orientation event received but gamma/beta are null');
      return;
    }
    
    console.log('Orientation:', e.gamma, e.beta);
    
    // Gamma: Left/Right tilt (-90 to 90)
    // Beta: Front/Back tilt (-180 to 180)
    
    // Clamp and normalize
    const xVal = Math.min(Math.max(e.gamma, -45), 45) / 45; 
    const yVal = Math.min(Math.max(e.beta - 45, -45), 45) / 45; // Offset beta for holding position

    api.start({ x: xVal, y: yVal });
    setValues({ 
      x: xVal, 
      y: yVal,
      tiltX: yVal * 20,
      tiltY: xVal * -20
    });
  }, [api]);

  const requestAccess = async () => {
    console.log('requestAccess called');
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        console.log('Requesting permission...');
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        console.log('Permission state:', permissionState);
        if (permissionState === 'granted') {
          setPermissionGranted(true);
          window.addEventListener('deviceorientation', handleOrientation);
          console.log('Permission granted, listener added');
        } else {
          console.log('Permission denied');
          alert("Permission denied. Please allow motion sensors in your browser settings.");
        }
      } catch (e) {
        console.error('Error requesting permission:', e);
        alert("Error: " + (e as Error).message + ". Ensure you are using HTTPS.");
      }
    } else {
      // Non-iOS 13+ devices (Android)
      console.log('No permission API, adding listener directly');
      setPermissionGranted(true);
      window.addEventListener('deviceorientation', handleOrientation);
    }
  };

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

    // Check if device orientation is supported/relevant (mobile)
    const checkMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(checkMobile);
    console.log('Is mobile:', checkMobile);

    if (checkMobile) {
       // Check if we need explicit permission (iOS 13+)
       const requiresPermission = typeof (DeviceOrientationEvent as any).requestPermission === 'function';
       console.log('Requires permission:', requiresPermission);
       setNeedsPermission(requiresPermission);
       
       if (!requiresPermission) {
          // Android or older iOS - try to add listener directly
          console.log('Adding orientation listener directly');
          window.addEventListener('deviceorientation', handleOrientation);
          setPermissionGranted(true);
       }
    } else {
      console.log('Desktop mode - using mouse');
      window.addEventListener('mousemove', handleMouseMove);
      setPermissionGranted(true); // No permission needed for desktop
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [api, handleOrientation]);

  return { x, y, values, requestAccess, isMobile, permissionGranted, needsPermission };
}
