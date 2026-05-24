import { useEffect, useRef, useState } from 'react';

// ═══ Data ════════════════════════════════════════════════════════════════════

const ITEMS = [
  { num: '01', layerIdx: 3, title: 'You bring models. We bring the compute.', body: 'Get complete AI factories integrating high-density power, liquid cooling, and NVIDIA GPUs into one system designed for peak AI performance.' },
  { num: '02', layerIdx: 2, title: 'Your supercomputer. Your rules.', body: 'Accelerate every stage of your AI lifecycle. Train foundation models and serve billions of tokens.' },
  { num: '03', layerIdx: 1, title: 'Orchestration, handled.', body: 'Run large-scale AI workloads without the operational burden. We manage your clusters so you can focus on innovation.' },
  { num: '04', layerIdx: 0, title: 'Experts included.', body: "Co-engineer your workloads with the very people building the infrastructure behind the world's most advanced models." },
];

// Index 0 = bottom (Co-engineering) … Index 3 = top (Purpose-built datacenters)
const LAYERS = [
  { label: 'Co-engineering',            rightLabel: 'SUPERINTELLIGENCE' },
  { label: 'Managed services',          rightLabel: 'ENTERPRISE'        },
  { label: 'AI infrastructure',         rightLabel: 'AI DEVELOPERS'     },
  { label: 'Purpose-built datacenters', rightLabel: null                },
];

// ═══ Isometric Geometry ═══════════════════════════════════════════════════════

function isoTop(cx, ly, W, H) {
  return [
    [cx,       ly      ],   // 0 – top
    [cx + W/2, ly + H/2],   // 1 – right
    [cx,       ly + H  ],   // 2 – bottom
    [cx - W/2, ly + H/2],   // 3 – left
  ];
}
function isoLeft(cx, ly, W, H, D) {
  const [, , bot, lft] = isoTop(cx, ly, W, H);
  return [lft, bot, [bot[0], bot[1] + D], [lft[0], lft[1] + D]];
}
function isoRight(cx, ly, W, H, D) {
  const [, rgt, bot] = isoTop(cx, ly, W, H);
  return [bot, rgt, [rgt[0], rgt[1] + D], [bot[0], bot[1] + D]];
}

// Proper isometric basis projection: s,t ∈ [0,1] span the top face
// canvas = top_vertex + s*(W/2, H/2) + t*(-W/2, H/2)
function isoBasis(cx, ly, W, H, s, t) {
  return [cx + (s - t) * W / 2, ly + (s + t) * H / 2];
}

function drawFill(ctx, pts, color, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color;
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.closePath(); ctx.fill(); ctx.restore();
}
function drawStroke(ctx, pts, color, lw = 1, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = lw;
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.closePath(); ctx.stroke(); ctx.restore();
}
function drawChroma(ctx, pts, lw = 1.2) {
  [
    [2,  'rgba(255,60,60,0.70)'],
    [0,  'rgba(60,255,140,0.35)'],
    [-2, 'rgba(60,100,255,0.70)'],
  ].forEach(([dx, col]) => drawStroke(ctx, pts.map(([x, y]) => [x + dx, y]), col, lw));
}

// ═══ Per-layer Animations ═════════════════════════════════════════════════════

// LAYER 3 ─ Purpose-built datacenters: ISO dot grid with glowing nodes
function animDotGrid(ctx, cx, ly, W, H, t) {
  const COLS = 7, ROWS = 5, PAD = 0.10;

  // Grid lines in the two iso directions
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 0.5;
  // Lines along "s" direction (constant t)
  for (let r = 0; r < ROWS; r++) {
    const t0 = PAD + (r / (ROWS - 1)) * (1 - 2 * PAD);
    ctx.beginPath();
    ctx.moveTo(...isoBasis(cx, ly, W, H, PAD, t0));
    ctx.lineTo(...isoBasis(cx, ly, W, H, 1 - PAD, t0));
    ctx.stroke();
  }
  // Lines along "t" direction (constant s)
  for (let c = 0; c < COLS; c++) {
    const s0 = PAD + (c / (COLS - 1)) * (1 - 2 * PAD);
    ctx.beginPath();
    ctx.moveTo(...isoBasis(cx, ly, W, H, s0, PAD));
    ctx.lineTo(...isoBasis(cx, ly, W, H, s0, 1 - PAD));
    ctx.stroke();
  }
  ctx.restore();

  // Dots at grid intersections
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const s = PAD + (c / (COLS - 1)) * (1 - 2 * PAD);
      const tv = PAD + (r / (ROWS - 1)) * (1 - 2 * PAD);
      const [x, y] = isoBasis(cx, ly, W, H, s, tv);
      const isBright = (c + r) % 2 === 0;

      if (isBright) {
        const pulse = 0.65 + 0.35 * Math.sin(t * 0.045 + c * 0.55 + r * 0.75);
        ctx.save();
        ctx.globalAlpha = 0.75 * pulse;
        ctx.fillStyle = '#ff5050'; ctx.beginPath(); ctx.arc(x + 1.2, y, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#50ff90'; ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#5090ff'; ctx.beginPath(); ctx.arc(x - 1.2, y, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = pulse;
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x, y, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      } else {
        ctx.save();
        ctx.globalAlpha = 0.28;
        ctx.strokeStyle = '#c0bfb8'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
    }
  }
}

// LAYER 2 ─ AI infrastructure: Nested concentric iso squares
function animNestedSquares(ctx, cx, ly, W, H, t) {
  const SCALES = [0.85, 0.66, 0.47, 0.30, 0.14];

  SCALES.forEach((s, si) => {
    // Center the nested face by shifting ly
    const newLy = ly + H * (1 - s) / 2;
    const pts = isoTop(cx, newLy, W * s, H * s);
    const pulse = 0.4 + 0.25 * Math.sin(t * 0.03 + si * 0.5);

    if (si === SCALES.length - 1) {
      // Innermost: filled + chromatic border
      drawFill(ctx, pts, '#0d0d0d');
      drawChroma(ctx, pts, 1.5);
    } else {
      const alpha = (0.08 + 0.12 * ((SCALES.length - si) / SCALES.length)) * (0.6 + 0.4 * pulse);
      drawStroke(ctx, pts, '#e7e6d9', 0.8, alpha);
    }
  });

  // Faint scatter dots on the face background
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  for (let i = 0; i < 60; i++) {
    const s = 0.1 + (Math.sin(i * 1.618) * 0.5 + 0.5) * 0.8;
    const tv = 0.1 + (Math.cos(i * 2.718) * 0.5 + 0.5) * 0.8;
    const [x, y] = isoBasis(cx, ly, W, H, s, tv);
    ctx.beginPath(); ctx.arc(x, y, 0.9, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

// LAYER 1 ─ Managed services: Concentric ellipses (circles projected on iso face)
function animCircles(ctx, cx, ly, W, H, t) {
  const fc = [cx, ly + H / 2];       // face centre
  const maxRx = W * 0.41;
  const ratioY = H / W;              // iso compression

  const RINGS = [0.95, 0.73, 0.52, 0.33, 0.15];

  RINGS.forEach((frac, ri) => {
    const rx = maxRx * frac;
    const ry = rx * ratioY;
    const pulse = 0.5 + 0.5 * Math.sin(t * 0.032 + ri * 0.45);

    if (ri === RINGS.length - 1) {
      // Innermost: chromatic
      [[2, 'rgba(255,60,60,0.9)'], [0, 'rgba(100,255,180,0.55)'], [-2, 'rgba(60,100,255,0.9)']].forEach(([dx, col]) => {
        ctx.save();
        ctx.strokeStyle = col; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.ellipse(fc[0] + dx, fc[1], rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      });
    } else {
      const alpha = (0.12 + 0.08 * (RINGS.length - ri) / RINGS.length) * (0.6 + 0.4 * pulse);
      ctx.save();
      ctx.strokeStyle = '#e7e6d9'; ctx.lineWidth = ri === 0 ? 0.6 : 0.9; ctx.globalAlpha = alpha;
      ctx.beginPath(); ctx.ellipse(fc[0], fc[1], rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
  });

  // Bright centre
  ctx.save();
  ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.9;
  ctx.beginPath(); ctx.arc(fc[0], fc[1], 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// LAYER 0 ─ Co-engineering: Orbit ring + dot cluster + chromatic nodes
function animOrbital(ctx, cx, ly, W, H, t) {
  const fc = [cx, ly + H / 2];
  const ratioY = H / W;
  const orbitRx = W * 0.38;
  const orbitRy = orbitRx * ratioY;

  // Orbit ring
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.65)'; ctx.lineWidth = 1.1;
  ctx.beginPath(); ctx.ellipse(fc[0], fc[1], orbitRx, orbitRy, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();

  // Dot cluster inside orbit
  const innerRx = orbitRx * 0.44;
  const innerRy = orbitRy * 1.05;
  const DCOLS = 9, DROWS = 7;
  ctx.save();
  for (let r = 0; r < DROWS; r++) {
    for (let c = 0; c < DCOLS; c++) {
      const du = c / (DCOLS - 1) * 2 - 1;
      const dv = r / (DROWS - 1) * 2 - 1;
      if (du * du + dv * dv > 0.92) continue;
      const px = fc[0] + du * innerRx;
      const py = fc[1] + dv * innerRy;
      ctx.globalAlpha = 0.45 + 0.3 * Math.sin(t * 0.04 + c * 0.3 + r * 0.5);
      ctx.fillStyle = '#aaa';
      ctx.beginPath(); ctx.arc(px, py, 1.3, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore();

  // Chromatic nodes at top & bottom of orbit ellipse
  [[fc[0], fc[1] - orbitRy], [fc[0], fc[1] + orbitRy]].forEach(([nx, ny]) => {
    ctx.save();
    ctx.fillStyle = '#ff5050'; ctx.globalAlpha = 0.85;
    ctx.beginPath(); ctx.arc(nx + 1.3, ny, 3.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#5090ff';
    ctx.beginPath(); ctx.arc(nx - 1.3, ny, 3.2, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1; ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(nx, ny, 2.6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  });
}

// Indexed by layerIdx: 0=Co-engineering, 1=Managed, 2=AI infra, 3=Purpose-built
const ANIM_FNS = [animOrbital, animCircles, animNestedSquares, animDotGrid];

// ═══ Main Scene Draw ══════════════════════════════════════════════════════════

function drawScene(ctx, W, H, activeLayerIdx, t) {
  ctx.clearRect(0, 0, W, H);

  // Layout
  const isoW = W * 0.60;
  const isoH = isoW * 0.40;
  const cx   = W * 0.37;       // shifted left to leave room for right labels

  const ACTIVE_D   = Math.max(36, H * 0.085);
  const INACTIVE_D = Math.max(6,  H * 0.016);
  const TOP_PAD    = H * 0.04;

  // Pre-compute Y positions: iterate top→bottom (layer 3 first, layer 0 last)
  const lyArr = new Array(4);
  const dArr  = new Array(4);
  let y = TOP_PAD;
  for (let i = LAYERS.length - 1; i >= 0; i--) {
    const d = (i === activeLayerIdx) ? ACTIVE_D : INACTIVE_D;
    lyArr[i] = y;
    dArr[i]  = d;
    y += isoH + d;
  }

  // ── Right-side dotted line + branches ──────────────────────────────────────
  const rightX   = cx + isoW / 2;
  const lineTop  = lyArr[3] + isoH / 2;
  const lineBot  = lyArr[0] + isoH + dArr[0] + isoH * 0.35;

  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx.lineWidth = 0.8;
  ctx.setLineDash([2.5, 4.5]);
  ctx.beginPath();
  ctx.moveTo(rightX, lineTop);
  ctx.lineTo(rightX, lineBot);
  ctx.stroke();
  ctx.restore();

  LAYERS.forEach((layer, i) => {
    if (!layer.rightLabel) return;
    // Branch connects at the right-corner Y of each layer's top face
    const branchY = lyArr[i] + isoH / 2;
    const labelX  = rightX + W * 0.14;

    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 0.8;
    ctx.setLineDash([2.5, 4.5]);
    ctx.beginPath();
    ctx.moveTo(rightX, branchY);
    ctx.lineTo(labelX - 6, branchY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = '10px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.fillText(layer.rightLabel, labelX, branchY + 3.5);
    ctx.restore();
  });

  // ── Draw layers (painter's order: layer 3 → layer 0) ──────────────────────
  for (let i = LAYERS.length - 1; i >= 0; i--) {
    const ly       = lyArr[i];
    const d        = dArr[i];
    const isActive = i === activeLayerIdx;
    const alpha    = isActive ? 1 : 0.30;

    const topFace   = isoTop(cx, ly, isoW, isoH);
    const leftFace  = isoLeft(cx, ly, isoW, isoH, d);
    const rightFace = isoRight(cx, ly, isoW, isoH, d);

    // Faces fill
    drawFill(ctx, leftFace,  isActive ? '#141414' : '#0c0c0c', alpha);
    drawFill(ctx, rightFace, isActive ? '#181818' : '#0d0d0d', alpha);
    drawFill(ctx, topFace,   isActive ? '#1d1d1d' : '#111111', alpha);

    if (isActive) {
      // Chromatic aberration on all three faces
      drawChroma(ctx, topFace,   1.3);
      drawChroma(ctx, leftFace,  1.0);
      drawChroma(ctx, rightFace, 1.0);
      // Run animation on top face
      ANIM_FNS[i](ctx, cx, ly, isoW, isoH, t);
    } else {
      drawStroke(ctx, topFace,   'rgba(255,255,255,0.13)', 0.7);
      drawStroke(ctx, leftFace,  'rgba(255,255,255,0.07)', 0.5);
      drawStroke(ctx, rightFace, 'rgba(255,255,255,0.09)', 0.5);
    }

    // ── Label on left face ────────────────────────────────────────────────────
    const [, , botPt, leftPt] = topFace;
    const fbl = [leftPt[0], leftPt[1] + d];   // face bottom-left
    const fbr = [botPt[0],  botPt[1]  + d];   // face bottom-right
    const angle = Math.atan2(fbr[1] - fbl[1], fbr[0] - fbl[0]);
    const fs    = isActive
      ? Math.max(15, isoW * 0.072)
      : Math.max(10, isoW * 0.052);

    ctx.save();
    ctx.globalAlpha = isActive ? 1 : 0.40;
    ctx.fillStyle   = '#e7e6d9';
    ctx.font        = `${isActive ? 700 : 400} ${fs}px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.translate(fbl[0] + 14, fbl[1] - (d * 0.22 + 5));
    ctx.rotate(angle);
    ctx.fillText(LAYERS[i].label, 0, 0);
    ctx.restore();
  }
}

// ═══ React Component ══════════════════════════════════════════════════════════

export default function AccordionLevelAnimation() {
  const [activeIdx, setActiveIdx] = useState(0);
  const canvasRef  = useRef(null);
  const tickRef    = useRef(0);
  const rafRef     = useRef(null);
  const ctxRef     = useRef(null);
  const sizeRef    = useRef({ W: 0, H: 0 });

  const activeLayerIdx = ITEMS[activeIdx]?.layerIdx ?? 3;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setup = () => {
      const dpr  = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const W = rect.width, H = rect.height;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      ctxRef.current  = ctx;
      sizeRef.current = { W, H };
    };
    setup();

    const loop = () => {
      tickRef.current++;
      const { W, H } = sizeRef.current;
      if (ctxRef.current && W > 0 && H > 0)
        drawScene(ctxRef.current, W, H, activeLayerIdx, tickRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [activeLayerIdx]);

  return (
    <section style={{ backgroundColor: '#0b0b0b', padding: 'clamp(64px, 8vw, 120px) 0' }}>
      <div style={{ maxWidth: 1398, margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>

        {/* Title */}
        <div style={{ marginBottom: 'clamp(40px, 5vw, 72px)', maxWidth: 680 }}>
          <h2 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 600,
            color: '#e7e6d9',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            Built for AI. Ready for superintelligence.
          </h2>
        </div>

        {/* Two columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '58% 42%',
          gap: 'clamp(24px, 4vw, 60px)',
          alignItems: 'start',
        }} className="acc-iso-grid">

          {/* Accordion */}
          <div>
            {ITEMS.map((item, i) => {
              const isOpen = activeIdx === i;
              return (
                <div key={i} style={{
                  borderTop: '0.5px solid #2a2a2a',
                  ...(i === ITEMS.length - 1 ? { borderBottom: '0.5px solid #2a2a2a' } : {}),
                }}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setActiveIdx(i)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', width: '100%',
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: 'clamp(18px, 2.5vw, 28px) 0', gap: 16, textAlign: 'left',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(1rem, 1.3vw, 1.2rem)',
                      fontWeight: 600, color: '#6236f4', minWidth: 36, paddingTop: 3,
                    }}>
                      {item.num}/
                    </span>
                    <span style={{
                      flex: 1, fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(1.05rem, 1.7vw, 1.45rem)',
                      fontWeight: 700, color: '#e7e6d9', lineHeight: 1.2, letterSpacing: '-0.015em',
                    }}>
                      {item.title}
                    </span>
                    <span style={{
                      fontSize: 22, color: isOpen ? '#e7e6d9' : '#444',
                      flexShrink: 0, paddingTop: 3, transition: 'color 0.25s',
                    }}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  <div style={{
                    overflow: 'hidden',
                    maxHeight: isOpen ? 200 : 0, opacity: isOpen ? 1 : 0,
                    transition: 'max-height 0.4s cubic-bezier(.6,0,.4,1), opacity 0.3s ease',
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.875rem',
                      color: '#888', lineHeight: 1.65,
                      margin: '0 0 clamp(18px, 2.5vw, 28px)', paddingLeft: 52,
                    }}>
                      {item.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Isometric canvas */}
          <div style={{ position: 'sticky', top: 80, width: '100%', aspectRatio: '4 / 5' }}>
            <canvas
              ref={canvasRef}
              style={{ display: 'block', width: '100%', height: '100%' }}
              aria-label="Isometric AI infrastructure layer diagram"
              role="img"
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .acc-iso-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
