// Clean Particles background component for WarpHero
// Uses tsParticles with a custom half‑circle (curved) path generator.
// It loads the slim bundle and the move plugin, then registers the path generator.

import { ParticlesProvider, Particles } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

import { Vector } from "@tsparticles/engine";

/**
 * Custom curved path generator (half‑circle arc).
 */
function registerCurvedPath(engine) {
  engine.pluginManager.addPathGenerator("curvedWarpPath", {
    init: () => {},
    generate: (particle) => {
      const container = particle.container;
      const canvasWidth = container.canvas.size.width;
      const canvasHeight = container.canvas.size.height;

      // Initialise per‑particle state once
      if (particle.baselineY === undefined) {
        particle.baselineY = particle.position.y ?? Math.random() * canvasHeight;
        particle.directionX = Math.random() > 0.5 ? 1 : -1; // left‑to‑right or reverse
        particle.speedMultiplier = 0.5 + Math.random() * 0.9; // subtle depth variation
      }

      const x = particle.position.x;
      const y0 = particle.baselineY;
      const centerY = canvasHeight / 2;
      const centerX = canvasWidth / 2;

      const baseSpeed = 2.4 * particle.speedMultiplier;
      const vx = baseSpeed * particle.directionX;
      const alpha = 0.42; // curvature factor
      const dx = x - centerX;
      const dy_dx = (2 * alpha * (y0 - centerY) * dx) / (centerX * centerX);
      const vy = dy_dx * vx;

      return Vector.create(vx, vy);
    },
    reset: (particle) => {
      particle.baselineY = undefined;
      particle.directionX = undefined;
      particle.speedMultiplier = undefined;
    },
    update: () => {},
  });
}

// Hexa (six‑pointed) path generator for particle motion
function registerHexaPath(engine) {
  engine.pluginManager.addPathGenerator("hexaPath", {
    init: () => {},
    generate: (particle) => {
      const container = particle.container;
      const canvasWidth = container.canvas.size.width;
      const canvasHeight = container.canvas.size.height;
      const baseRadius = Math.min(canvasWidth, canvasHeight) * 0.3;
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;

      if (particle.angle === undefined) {
        particle.angle = Math.random() * Math.PI * 2;
        particle.angularSpeed = 0.001 + Math.random() * 0.003;
      }

      const angle = particle.angle;
      // Modulate radius to create six‑pointed shape
      const radius = baseRadius * (1 + 0.25 * Math.sin(6 * angle));
      const vx = -radius * Math.sin(angle) * particle.angularSpeed;
      const vy = radius * Math.cos(angle) * particle.angularSpeed;

      particle.angle += particle.angularSpeed;
      return Vector.create(vx, vy);
    },
    reset: (particle) => {
      particle.angle = undefined;
      particle.angularSpeed = undefined;
    },
    update: () => {}
  });
}


export default function ParticlesBg({ className = "" }) {
  const initFn = async (engine) => {
    try {
      await loadSlim(engine);
      // loadMovePlugin removed due to no longer needed
      registerCurvedPath(engine);
      registerHexaPath(engine);
    } catch (err) {
      console.error("tsParticles init error:", err);
    }
  };

  const options = {
    fullScreen: { enable: false },
    detectRetina: true,
    fpsLimit: 120,
    background: { color: { value: "transparent" } },
    particles: {
      number: { value: 70, density: { enable: false } },
      color: {
        value: ["#00f0ff", "#a020f0", "#ff007f", "#39ff14", "#ffb703", "#ff0055"],
      },
      shape: { type: "circle" },
      opacity: { value: { min: 0.15, max: 0.7 }, animation: { enable: true, speed: 1.2, sync: false } },
      size: { value: { min: 1.2, max: 3.2 } },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: false,
        straight: false,
        outModes: { default: "out" },
        path: { enable: true, generator: "hexaPath" },
        trail: { enable: true, length: 28, fillColor: { value: "#0b0b0b" } },
      },
    },
  };

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <ParticlesProvider init={initFn}>
        <Particles id="curved-warp-particles" options={options} />
      </ParticlesProvider>
    </div>
  );
}
