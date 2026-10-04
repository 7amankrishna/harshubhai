import confetti from 'canvas-confetti';

export const triggerBirthdayConfetti = () => {
  const duration = 4.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: ReturnType<typeof setInterval> = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Left cannon
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24', '#38bdf8', '#ffffff'],
      shapes: ['circle', 'square']
    });

    // Right cannon
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24', '#38bdf8', '#ffffff'],
      shapes: ['circle', 'square']
    });
  }, 250);
};

export const triggerHeartBurst = (x: number = 0.5, y: number = 0.5) => {
  confetti({
    particleCount: 40,
    spread: 70,
    origin: { x, y },
    colors: ['#ec4899', '#f43f5e', '#c084fc', '#fda4af'],
    zIndex: 9999,
  });
};

export const triggerStarBurst = (x: number = 0.5, y: number = 0.5) => {
  confetti({
    particleCount: 45,
    spread: 90,
    startVelocity: 35,
    origin: { x, y },
    colors: ['#fbbf24', '#f59e0b', '#ffffff', '#e879f9'],
    shapes: ['star'],
    zIndex: 9999,
  });
};
