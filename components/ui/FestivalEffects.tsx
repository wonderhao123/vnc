'use client';

import { useEffect, useState, useRef } from 'react';

type FestivalType = 'snow' | 'fireworks' | 'sakura' | 'leaves' | 'hearts' | 'sparkles' | null;

interface FestivalConfig {
  type: FestivalType;
  name: string;
}

// Determine festival based on current date
function getCurrentFestival(): FestivalConfig {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();

  // New Year (Dec 31 - Jan 3)
  if ((month === 12 && day >= 28) || (month === 1 && day <= 3)) {
    return { type: 'fireworks', name: 'New Year' };
  }
  
  // Valentine's Day (Feb 10-14)
  if (month === 2 && day >= 10 && day <= 14) {
    return { type: 'hearts', name: "Valentine's Day" };
  }
  
  // Spring/Sakura (March 20 - April 15)
  if ((month === 3 && day >= 20) || (month === 4 && day <= 15)) {
    return { type: 'sakura', name: 'Spring' };
  }
  
  // Autumn/Fall Leaves (Oct 1 - Nov 15)
  if ((month === 10) || (month === 11 && day <= 15)) {
    return { type: 'leaves', name: 'Autumn' };
  }
  
  // Christmas (Dec 20-26)
  if (month === 12 && day >= 20 && day <= 26) {
    return { type: 'sparkles', name: 'Christmas' };
  }
  
  // Winter/Snow (Dec 1-27, Jan 4-31, Feb 1-28)
  if ((month === 12 && day < 28) || month === 1 || month === 2) {
    return { type: 'snow', name: 'Winter' };
  }

  return { type: null, name: '' };
}

export function FestivalEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [festival] = useState<FestivalConfig>(getCurrentFestival());

  useEffect(() => {
    if (!festival.type) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    let animationId: number;
    let particles: any[] = [];

    // Initialize particles based on festival type
    const initParticles = () => {
      particles = [];
      const particleCount = festival.type === 'fireworks' ? 0 : 80;

      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
      }
    };

    const createParticle = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;

      switch (festival.type) {
        case 'snow':
          return {
            x,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 3 + 1,
            speedY: Math.random() * 1 + 0.5,
            speedX: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.6 + 0.4,
          };
        
        case 'sakura':
          return {
            x,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 8 + 4,
            speedY: Math.random() * 1.5 + 0.5,
            speedX: Math.random() * 2 - 1,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.05,
            opacity: Math.random() * 0.6 + 0.4,
          };
        
        case 'leaves':
          return {
            x,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 10 + 5,
            speedY: Math.random() * 2 + 1,
            speedX: Math.random() * 2 - 1,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.08,
            opacity: Math.random() * 0.7 + 0.3,
            color: Math.random() > 0.5 ? '#ff6b35' : '#ffa500',
          };
        
        case 'hearts':
          return {
            x,
            y: canvas.height + Math.random() * 100,
            size: Math.random() * 12 + 6,
            speedY: -Math.random() * 2 - 1,
            speedX: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.3,
            rotation: Math.random() * 0.2 - 0.1,
          };
        
        case 'sparkles':
          return {
            x,
            y,
            size: Math.random() * 4 + 2,
            speedY: Math.random() * 1 + 0.5,
            speedX: Math.random() * 0.5 - 0.25,
            opacity: Math.random(),
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.1 + 0.05,
          };
        
        default:
          return { x, y, size: 1, speedY: 0, speedX: 0, opacity: 1 };
      }
    };

    // Fireworks system
    let fireworks: any[] = [];
    let fireworkTimer = 0;

    const createFirework = () => {
      const x = Math.random() * canvas.width;
      const y = canvas.height;
      const targetY = Math.random() * canvas.height * 0.5;
      
      return {
        x,
        y,
        targetY,
        exploded: false,
        particles: [],
        speed: 5,
        hue: Math.random() * 360,
      };
    };

    const explodeFirework = (firework: any) => {
      const particleCount = 50;
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = Math.random() * 3 + 2;
        firework.particles.push({
          x: firework.x,
          y: firework.targetY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1,
          decay: Math.random() * 0.015 + 0.01,
          size: Math.random() * 3 + 1,
        });
      }
      firework.exploded = true;
    };

    // Drawing functions
    const drawSnowflake = (particle: any) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
      ctx.fill();
      
      // Add slight glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(200, 230, 255, 0.5)';
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawSakura = (particle: any) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      
      // Draw simple petal shape
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        const x = Math.cos(angle) * particle.size;
        const y = Math.sin(angle) * particle.size;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(255, 182, 193, ${particle.opacity})`;
      ctx.fill();
      
      ctx.restore();
    };

    const drawLeaf = (particle: any) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      
      ctx.beginPath();
      ctx.ellipse(0, 0, particle.size * 0.6, particle.size, 0, 0, Math.PI * 2);
      ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.fill();
      
      ctx.restore();
    };

    const drawHeart = (particle: any) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      
      const size = particle.size;
      ctx.beginPath();
      ctx.moveTo(0, size / 4);
      ctx.bezierCurveTo(-size / 2, -size / 4, -size, size / 8, 0, size);
      ctx.bezierCurveTo(size, size / 8, size / 2, -size / 4, 0, size / 4);
      ctx.fillStyle = `rgba(255, 105, 180, ${particle.opacity})`;
      ctx.fill();
      
      ctx.restore();
    };

    const drawSparkle = (particle: any) => {
      const opacity = particle.opacity * Math.abs(Math.sin(particle.twinkle));
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 2
      );
      gradient.addColorStop(0, `rgba(255, 215, 0, ${opacity})`);
      gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.5})`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Handle fireworks
      if (festival.type === 'fireworks') {
        fireworkTimer++;
        if (fireworkTimer > 60) {
          fireworks.push(createFirework());
          fireworkTimer = 0;
        }

        fireworks = fireworks.filter(firework => {
          if (!firework.exploded) {
            firework.y -= firework.speed;
            if (firework.y <= firework.targetY) {
              explodeFirework(firework);
            }
            
            // Draw rocket
            ctx.beginPath();
            ctx.arc(firework.x, firework.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${firework.hue}, 100%, 60%)`;
            ctx.fill();
            
            return true;
          } else {
            // Draw explosion particles
            firework.particles = firework.particles.filter((p: any) => {
              p.x += p.vx;
              p.y += p.vy;
              p.vy += 0.05; // gravity
              p.life -= p.decay;
              
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fillStyle = `hsla(${firework.hue}, 100%, 60%, ${p.life})`;
              ctx.fill();
              
              // Add glow
              ctx.shadowBlur = 10;
              ctx.shadowColor = `hsl(${firework.hue}, 100%, 60%)`;
              ctx.fill();
              ctx.shadowBlur = 0;
              
              return p.life > 0;
            });
            
            return firework.particles.length > 0;
          }
        });
      }

      // Handle other particles
      particles.forEach((particle, index) => {
        // Update position
        particle.y += particle.speedY;
        particle.x += particle.speedX;

        if (particle.rotation !== undefined) {
          particle.rotation += particle.rotationSpeed;
        }

        if (particle.twinkle !== undefined) {
          particle.twinkle += particle.twinkleSpeed;
        }

        // Reset particle if off screen
        if (festival.type === 'hearts') {
          if (particle.y < -50) {
            Object.assign(particle, createParticle());
          }
        } else {
          if (particle.y > canvas.height + 50) {
            particle.y = -50;
            particle.x = Math.random() * canvas.width;
          }
        }

        // Draw based on type
        switch (festival.type) {
          case 'snow':
            drawSnowflake(particle);
            break;
          case 'sakura':
            drawSakura(particle);
            break;
          case 'leaves':
            drawLeaf(particle);
            break;
          case 'hearts':
            drawHeart(particle);
            break;
          case 'sparkles':
            drawSparkle(particle);
            break;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, [festival]);

  if (!festival.type) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ mixBlendMode: festival.type === 'sparkles' ? 'screen' : 'normal' }}
      />
      {/* Festival label */}
      <div className="fixed top-4 right-4 z-50 pointer-events-none">
        <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-xs font-mono">
          ✨ {festival.name}
        </div>
      </div>
    </>
  );
}
