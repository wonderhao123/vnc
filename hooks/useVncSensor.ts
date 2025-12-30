import { useEffect, useState, useCallback } from 'react';
import { useSpring } from '@react-spring/web';

interface SensorValues {
  x: number; // -1 to 1
  y: number; // -1 to 1
  tiltX: number; // For 3D rotation degrees
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
    // gamma: left-right tilt (approx -90..90)
    // beta: front-back tilt (approx -180..180)
    const gamma = e.gamma ?? 0;
    const beta = e.beta ?? 0;

    // Normalize to -1..1 (clamp to reasonable ranges)
    const xVal = Math.max(-1, Math.min(1, gamma / 30)); // make it less sensitive
    const yVal = Math.max(-1, Math.min(1, beta / 45));

    api.start({ x: xVal, y: yVal });
    setValues({ x: xVal, y: yVal, tiltX: yVal * 15, tiltY: xVal * -15 });
  }, [api]);

  const requestAccess = useCallback(async () => {
    // iOS requires explicit permission
    if (typeof (DeviceOrientationEvent as any)?.requestPermission === 'function') {
      try {
        const resp = await (DeviceOrientationEvent as any).requestPermission();
        if (resp === 'granted') {
          setPermissionGranted(true);
          window.addEventListener('deviceorientation', handleOrientation);
        }
      } catch (err) {
        // ignore
      }
    } else {
      // Not iOS, permission not required
      setPermissionGranted(true);
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }, [handleOrientation]);

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

    const ua = navigator.userAgent || '';
    const mobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    setIsMobile(mobile);

    // Detect if deviceorientation needs permission (iOS 13+)
    const needPerm = typeof (DeviceOrientationEvent as any)?.requestPermission === 'function';
    setNeedsPermission(needPerm);

    window.addEventListener('mousemove', handleMouseMove);

    if (!needPerm && 'DeviceOrientationEvent' in window) {
      // Attach directly for non-iOS
      window.addEventListener('deviceorientation', handleOrientation as EventListener);
      setPermissionGranted(true);
    } else if (needPerm) {
      // For iOS devices that require explicit permission, request on first user gesture
      const onFirstTouch = () => {
        requestAccess();
        window.removeEventListener('touchstart', onFirstTouch);
      };
      window.addEventListener('touchstart', onFirstTouch, { passive: true });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation as EventListener);
    };
  }, [api, handleOrientation]);

  return { x, y, values, requestAccess, isMobile, permissionGranted, needsPermission };
}
