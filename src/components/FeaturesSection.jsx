import { useState } from 'react';

const ITEMS = [
  {
    number: '01',
    title: 'You bring models. We bring the compute.',
    body: 'Get complete AI factories integrating high-density power, liquid cooling, and NVIDIA GPUs into one system designed for peak AI performance.',
    locked: true,
  },
  {
    number: '02',
    title: 'Your supercomputer. Your rules.',
    body: 'Accelerate every stage of your AI lifecycle. Train foundation models and serve billions of tokens.',
    locked: false,
  },
  {
    number: '03',
    title: 'Orchestration, handled.',
    body: 'Run large-scale AI workloads without the operational burden. We manage your clusters so you can focus on innovation.',
    locked: false,
  },
  {
    number: '04',
    title: 'Experts included.',
    body: 'Co-engineer your workloads with the very people building the infrastructure behind the world\'s most advanced models.',
    locked: false,
  },
];

const LAYERS = [
  { label: 'Purpose-built datacenters', accent: '#00e6d9' },
  { label: 'AI infrastructure',         accent: '#6236f4' },
  { label: 'Managed services',          accent: '#b0afa6' },
  { label: 'Co-engineering',            accent: '#6236f4' },
];
const SIDE_LABELS = ['AI DEVELOPERS', 'ENTERPRISE', 'SUPERINTELLIGENCE'];

function IsometricIllustration() {
  /* Simple flat-card isometric stack in SVG */
  const W = 260, H = 56, GAP = 10, LEFT = 50, DEPTH = 22;
  return (
    <svg viewBox="0 0 400 400" width="100%" style={{ maxWidth: 380, display: 'block' }} aria-hidden="true">
      {LAYERS.map((layer, i) => {
        const y = 40 + i * (H + GAP);
        const x0 = LEFT, x1 = x0 + W;
        const y0 = y,   y1 = y + H;
        /* dot grid */
        const cols = 9, rows = 3;
        const dots = [];
        for (let r = 0; r < rows; r++)
          for (let c = 0; c < cols; c++)
            dots.push({ cx: x0 + 14 + c * ((W - 28) / (cols - 1)), cy: y0 + 10 + r * ((H - 20) / (rows - 1)) });

        return (
          <g key={i}>
            {/* face */}
            <rect x={x0} y={y0} width={W} height={H} fill="#111" stroke={layer.accent} strokeWidth={0.5} strokeOpacity={0.35} />
            {/* top border accent */}
            <line x1={x0} y1={y0} x2={x1} y2={y0} stroke={layer.accent} strokeWidth={1.2} />
            {/* left depth face */}
            <polygon
              points={`${x0},${y0} ${x0-DEPTH},${y0+DEPTH*0.5} ${x0-DEPTH},${y1+DEPTH*0.5} ${x0},${y1}`}
              fill="#0a0a0a" stroke={layer.accent} strokeWidth={0.4} strokeOpacity={0.25}
            />
            {/* bottom depth (bottom edge of the left face) */}
            <line x1={x0-DEPTH} y1={y1+DEPTH*0.5} x2={x0} y2={y1} stroke={layer.accent} strokeWidth={0.4} strokeOpacity={0.25} />
            {/* dots */}
            {dots.map((d, di) => <circle key={di} cx={d.cx} cy={d.cy} r={0.9} fill={layer.accent} fillOpacity={0.22} />)}
            {/* label */}
            <text x={x0 + 14} y={y0 + H / 2 + 4} fill="#e7e6d9" fontSize={10.5} fontFamily="'Suisse Intl Mono', monospace">{layer.label}</text>
            {/* corner accents */}
            <circle cx={x0} cy={y0} r={2.5} fill={layer.accent} />
            <circle cx={x1} cy={y0} r={2.5} fill={layer.accent} opacity={0.7} />
          </g>
        );
      })}

      {/* right-side vertical labels */}
      <line x1={340} y1={35} x2={340} y2={340} stroke="#262625" strokeWidth={1} />
      {SIDE_LABELS.map((label, i) => (
        <g key={i} transform={`translate(352, ${65 + i * 92}) rotate(90)`}>
          <text fill="#42413e" fontSize={8} fontFamily="'Suisse Intl Mono', monospace" letterSpacing={2}>{label}</text>
        </g>
      ))}
      {SIDE_LABELS.map((_, i) => (
        <circle key={i} cx={340} cy={65 + i * 92} r={2} fill="#42413e" />
      ))}
    </svg>
  );
}

export default function FeaturesSection() {
  const [openIndex, setOpenIndex] = useState(0);

  function handleToggle(i) {
    if (ITEMS[i].locked) return;
    setOpenIndex(prev => (prev === i ? 0 : i));
  }

  return (
    <section style={{
      backgroundColor: 'var(--color-terminal)',
      paddingTop: 'clamp(100px, 12vw, 160px)',
      paddingBottom: 'clamp(100px, 12vw, 160px)',
      position: 'relative',
    }}>
      {/* Section top border */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: '#262625' }} />

      <div style={{ maxWidth: 1398, margin: '0 auto', padding: '0 15px' }}>

        {/* Section heading — capped to 58% at desktop */}
        <div style={{ marginBottom: 60 }}>
          <h2 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(2.3rem, 6vw, 4.5rem)',
            fontWeight: 600,
            lineHeight: '110%',
            letterSpacing: '-0.02em',
            color: '#e7e6d9',
            margin: 0,
          }}>
            Built for AI. Ready for superintelligence.
          </h2>
        </div>

        {/* Two-column content row */}
        <div className="features-row">

          {/* Left: Accordion (7/12) */}
          <div className="features-col-accordion">
            {ITEMS.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '48px 1fr',
                  gap: '0 24px',
                  borderTop: '1px solid #262625',
                  padding: '20px 0',
                }}>
                  {/* Number */}
                  <div>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8125rem',
                      color: '#595852',
                      display: 'block',
                      paddingTop: 4,
                    }}>{item.number}/</span>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 style={{ margin: 0 }}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => handleToggle(i)}
                        style={{
                          all: 'unset',
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: 16,
                          cursor: item.locked ? 'default' : 'pointer',
                          fontFamily: 'var(--font-sans)',
                          fontSize: 'clamp(1rem, 1.8vw, 1.35rem)',
                          fontWeight: 600,
                          color: '#e7e6d9',
                          letterSpacing: '-0.01em',
                          lineHeight: '130%',
                        }}
                      >
                        <span>{item.title}</span>
                        <span style={{
                          flexShrink: 0,
                          fontFamily: 'var(--font-mono)',
                          fontSize: '1.1rem',
                          fontWeight: 400,
                          color: '#595852',
                          lineHeight: 1,
                          marginTop: 2,
                        }}>{isOpen ? '−' : '+'}</span>
                      </button>
                    </h3>

                    <div
                      role="region"
                      className={`accordion-item-content${isOpen ? ' open' : ''}`}
                      {...(!isOpen ? { inert: true } : {})}
                    >
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.9375rem',
                        color: '#b0afa6',
                        lineHeight: '150%',
                        paddingTop: 14,
                        maxWidth: 500,
                      }}>{item.body}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Isometric illustration (5/12) */}
          <div className="features-col-illustration">
            <IsometricIllustration />
          </div>

        </div>
      </div>

      <style>{`
        .features-row {
          display: flex;
          flex-direction: column;
          gap: 60px;
        }
        .features-col-accordion { width: 100%; }
        .features-col-illustration { display: none; }

        @media (min-width: 1024px) {
          .features-row {
            flex-direction: row;
            gap: 40px;
            align-items: flex-start;
          }
          .features-col-accordion {
            flex: 0 0 58.33%;
            width: 58.33%;
          }
          .features-col-illustration {
            display: flex;
            flex: 1;
            align-items: flex-start;
            justify-content: center;
            padding-top: 10px;
          }
        }
      `}</style>
    </section>
  );
}
