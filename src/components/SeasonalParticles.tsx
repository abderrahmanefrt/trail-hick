import React, { useEffect, useRef } from 'react';
import type { SeasonId } from '@/types/trailvision';

interface SeasonalParticlesProps {
  season?: SeasonId;
  density?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  shape: 'circle' | 'petal' | 'leaf' | 'snowflake';
}

export default function SeasonalParticles({
  season = 'spring',
  density = 28,
  className = '',
}: SeasonalParticlesProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];

    const getSeasonConfig = () => {
      switch (season) {
        case 'spring':
          return {
            colors: ['#FBCFE8', '#F472B6', '#FEE2E2', '#E0F2FE', '#86EFAC'],
            shape: 'petal' as const,
            baseSpeedY: 1.2,
            baseSpeedX: 0.8,
            sizeRange: [5, 11] as [number, number],
          };
        case 'summer':
          return {
            colors: ['#FEF08A', '#FDE047', '#FBBF24', '#F59E0B', '#FED7AA'],
            shape: 'circle' as const,
            baseSpeedY: -0.6, // floating heat shimmer upward
            baseSpeedX: 0.3,
            sizeRange: [3, 8] as [number, number],
          };
        case 'fall':
          return {
            colors: ['#EA580C', '#C2410C', '#D97706', '#B45309', '#78350F'],
            shape: 'leaf' as const,
            baseSpeedY: 1.6,
            baseSpeedX: 1.1,
            sizeRange: [8, 16] as [number, number],
          };
        case 'winter':
        default:
          return {
            colors: ['#FFFFFF', '#F0F9FF', '#E0F2FE', '#BAE6FD'],
            shape: 'snowflake' as const,
            baseSpeedY: 1.4,
            baseSpeedX: 0.5,
            sizeRange: [3, 7] as [number, number],
          };
      }
    };

    const config = getSeasonConfig();

    for (let i = 0; i < density; i++) {
      const size =
        config.sizeRange[0] +
        Math.random() * (config.sizeRange[1] - config.sizeRange[0]);
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        speedX: (Math.random() - 0.5) * config.baseSpeedX * 2,
        speedY: config.baseSpeedY * (0.6 + Math.random() * 0.8),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.04,
        opacity: 0.3 + Math.random() * 0.5,
        color: config.colors[Math.floor(Math.random() * config.colors.length)] ?? '#ffffff',
        shape: config.shape,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'petal') {
          // Petal curve
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'leaf') {
          // Leaf shape
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.quadraticCurveTo(p.size * 0.7, 0, 0, p.size);
          ctx.quadraticCurveTo(-p.size * 0.7, 0, 0, -p.size);
          ctx.fill();
        } else if (p.shape === 'snowflake') {
          // Soft snowflake crystal
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
          // Subtle glow ring
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        } else {
          // Golden sun bokeh circle
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        // Update positions
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.4;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Wrap around boundaries
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        } else if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        if (p.x > width + 20) {
          p.x = -20;
        } else if (p.x < -20) {
          p.x = width + 20;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [season, density]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-10 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
