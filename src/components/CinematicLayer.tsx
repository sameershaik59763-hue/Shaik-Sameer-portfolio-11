import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  speedY: number;
  speedX: number;
  amplitudeY: number;
  amplitudeX: number;
  angleY: number;
  angleX: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
}

export default function CinematicLayer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 65; // High performance density

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const colors = [
        "rgba(245, 158, 11, ",   // Amber/Orange
        "rgba(251, 191, 36, ",   // Golden orange
        "rgba(249, 115, 22, ",   // Neon Orange
        "rgba(255, 255, 255, ",  // Soft White
        "rgba(34, 211, 238, "    // Subtle cyber blue
      ];

      for (let i = 0; i < particleCount; i++) {
        // Distribute nicely across the screen
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 22 + 4; // Large soft bokeh circles
        const colorIdx = Math.random() < 0.65 ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 2) + 3;

        particles.push({
          x: x,
          y: y,
          baseX: x,
          baseY: y,
          size: size,
          speedY: -(Math.random() * 0.4 + 0.1), // Drift upwards
          speedX: (Math.random() * 0.2 - 0.1),
          amplitudeY: Math.random() * 25 + 5,
          amplitudeX: Math.random() * 20 + 5,
          angleY: Math.random() * Math.PI * 2,
          angleX: Math.random() * Math.PI * 2,
          color: colors[colorIdx],
          alpha: Math.random() * 0.4 + 0.15,
          pulseSpeed: Math.random() * 0.015 + 0.005
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -0.5 to 0.5
      mouseRef.current.targetX = (e.clientX / window.innerWidth) - 0.5;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) - 0.5;
    };

    const draw = () => {
      // Clear with very slight fade for trace motion, or true transparent
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Interpolate mouse coordinates for gorgeous laggy cinematic feel (inertia)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      const parallaxX = mouseRef.current.x * 65; // Speed multiplier for parallax
      const parallaxY = mouseRef.current.y * 65;

      // Enable additive blending for glowing magic overlays
      ctx.globalCompositeOperation = "screen";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Wave oscillation calculations
        p.angleY += 0.002;
        p.angleX += 0.001;
        
        // Accumulate baseline drifts
        p.baseY += p.speedY;
        p.baseX += p.speedX;

        // Wrap around boundaries
        if (p.baseY < -50) {
          p.baseY = canvas.height + 50;
          p.baseX = Math.random() * canvas.width;
        }
        if (p.baseX < -50 || p.baseX > canvas.width + 50) {
          p.baseX = Math.random() * canvas.width;
        }

        // Apply sine oscillations and mouse parallax shifts
        const currentShiftX = Math.sin(p.angleX) * p.amplitudeX + (parallaxX * (p.size / 15));
        const currentShiftY = Math.cos(p.angleY) * p.amplitudeY + (parallaxY * (p.size / 15));

        p.x = p.baseX + currentShiftX;
        p.y = p.baseY + currentShiftY;

        // Dynamic pulsing alpha
        const currentAlpha = p.alpha * (0.7 + Math.sin(p.angleY * 2) * 0.3);

        // Glowing soft blurred circle
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, p.color + currentAlpha + ")");
        gradient.addColorStop(0.3, p.color + currentAlpha * 0.5 + ")");
        gradient.addColorStop(1, p.color + "0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Restore normal blending for potential other items
      ctx.globalCompositeOperation = "source-over";

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    
    // Initialize
    resizeCanvas();
    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      id="cinematic-bokeh-canvas"
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full z-10 select-none"
    />
  );
}
