'use client';

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  opacitySpeed: number;
  color: string;
}

interface FloatingHeart {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  emoji: string;
}

export const BackgroundStars: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initialize stars
    const starColors = ['#ffffff', '#f472b6', '#c084fc', '#fde047', '#93c5fd'];
    const starCount = Math.min(Math.floor((width * height) / 10000), 120);
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.8 + 0.2,
      opacitySpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      color: starColors[Math.floor(Math.random() * starColors.length)],
    }));

    // Floating subtle hearts/sparkles
    const emojis = ['✨', '💖', '🌸', '💫', '⭐', '🎈'];
    const hearts: FloatingHeart[] = Array.from({ length: 14 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 14 + 10,
      speedY: -(Math.random() * 0.4 + 0.2),
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.15,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.8,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render glowing ambient orbs in background
      const grad1 = ctx.createRadialGradient(width * 0.2, height * 0.25, 10, width * 0.2, height * 0.25, width * 0.4);
      grad1.addColorStop(0, 'rgba(139, 92, 246, 0.12)');
      grad1.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(width * 0.8, height * 0.7, 10, width * 0.8, height * 0.7, width * 0.45);
      grad2.addColorStop(0, 'rgba(236, 72, 153, 0.1)');
      grad2.addColorStop(1, 'rgba(236, 72, 153, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Draw stars
      stars.forEach((star) => {
        star.opacity += star.opacitySpeed;
        if (star.opacity > 1 || star.opacity < 0.2) {
          star.opacitySpeed = -star.opacitySpeed;
        }

        star.x += star.speedX;
        star.y += star.speedY;

        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, star.opacity));
        ctx.fillStyle = star.color;
        ctx.shadowBlur = star.size * 3;
        ctx.shadowColor = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw floating emoji sparkles
      hearts.forEach((heart) => {
        heart.y += heart.speedY;
        heart.x += heart.speedX;
        heart.rotation += heart.rotationSpeed;

        if (heart.y < -50) {
          heart.y = height + 30;
          heart.x = Math.random() * width;
        }

        ctx.save();
        ctx.globalAlpha = heart.opacity;
        ctx.font = `${heart.size}px sans-serif`;
        ctx.translate(heart.x, heart.y);
        ctx.rotate((heart.rotation * Math.PI) / 180);
        ctx.fillText(heart.emoji, -heart.size / 2, heart.size / 2);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
};
