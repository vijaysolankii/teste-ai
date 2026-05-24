import { useEffect, useRef } from 'react';

// Curved particle lines flowing left to right, fanning from a center vanishing point
export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let width, height;

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Colors for streaks (multicolored like the reference)
    const colors = [
      'rgba(255,255,255,',
      'rgba(150,180,255,',
      'rgba(180,120,255,',
      'rgba(100,220,255,',
      'rgba(255,200,100,',
      'rgba(200,255,180,',
      'rgba(255,100,200,',
    ];

    const NUM_LINES = 80;
    const lines = [];

    function randomLine() {
      // Lines emanate from a center-left vanishing point and curve outward
      const vpX = width * 0.5;
      const vpY = height * 0.5;
      // Spread angle: full fan
      const angle = (Math.random() - 0.5) * Math.PI * 1.1;
      const speed = 1.5 + Math.random() * 3;
      const length = 80 + Math.random() * 200;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const opacity = 0.2 + Math.random() * 0.6;
      // Distance along the ray (how far from vanishing point the head starts)
      const startDist = Math.random() * width * 0.6;
      // Curvature: slight arc
      const curve = (Math.random() - 0.5) * 0.003;
      return { vpX, vpY, angle, speed, length, color, opacity, startDist, curve, currentDist: startDist };
    }

    for (let i = 0; i < NUM_LINES; i++) {
      const l = randomLine();
      l.currentDist = Math.random() * width; // stagger starts
      lines.push(l);
    }

    function drawLine(l) {
      const { vpX, vpY, angle, length, color, opacity, currentDist, curve } = l;

      // Head position
      const headAngle = angle + curve * currentDist;
      const hx = vpX + Math.cos(headAngle) * currentDist;
      const hy = vpY + Math.sin(headAngle) * currentDist;

      // Tail position
      const tailDist = Math.max(0, currentDist - length);
      const tailAngle = angle + curve * tailDist;
      const tx = vpX + Math.cos(tailAngle) * tailDist;
      const ty = vpY + Math.sin(tailAngle) * tailDist;

      // Draw curved streak via bezier
      const midDist = (currentDist + tailDist) / 2;
      const midAngle = angle + curve * midDist;
      const mx = vpX + Math.cos(midAngle) * midDist;
      const my = vpY + Math.sin(midAngle) * midDist;

      const grad = ctx.createLinearGradient(tx, ty, hx, hy);
      grad.addColorStop(0, `${color}0)`);
      grad.addColorStop(0.7, `${color}${opacity})`);
      grad.addColorStop(1, `${color}${Math.min(1, opacity * 1.5)})`);

      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.quadraticCurveTo(mx, my, hx, hy);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 0.5 + Math.random() * 1;
      ctx.stroke();
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);

      // Radial fade mask: dark in center, lighter at edges
      const radGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.6);
      radGrad.addColorStop(0, 'rgba(11,11,11,0.4)');
      radGrad.addColorStop(1, 'rgba(11,11,11,0)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);

      for (const l of lines) {
        // Update vanishing point center to match current width/height
        l.vpX = width / 2;
        l.vpY = height / 2;

        drawLine(l);
        l.currentDist += l.speed;

        // Reset once head exits screen
        const hx = l.vpX + Math.cos(l.angle + l.curve * l.currentDist) * l.currentDist;
        const hy = l.vpY + Math.sin(l.angle + l.curve * l.currentDist) * l.currentDist;
        if (hx < -100 || hx > width + 100 || hy < -100 || hy > height + 100) {
          const fresh = randomLine();
          fresh.currentDist = 0;
          Object.assign(l, fresh);
        }
      }

      animId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    />
  );
}
