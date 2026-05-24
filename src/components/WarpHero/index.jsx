import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ParticlesBg from './ParticlesBg';

// ─── All swappable character positions across 3 words ────────
const HEADING = ['The', 'Superintelligence', 'Cloud'];
const ALL_CANDIDATES = [
  [0, 0], [0, 1], [0, 2],                                         // T, h, e
  [1, 0], [1, 2], [1, 5], [1, 7], [1, 9], [1, 12], [1, 15],       // S,p,r,i,l,g,e in Superintelligence
  [2, 0], [2, 1], [2, 2], [2, 3],                                 // C,l,o,u in Cloud
];

function usePixelSwap(interval = 2500) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      const pick = ALL_CANDIDATES[Math.floor(Math.random() * ALL_CANDIDATES.length)];
      setActive(`${pick[0]}-${pick[1]}`);
    }, interval);
    return () => clearInterval(id);
  }, [interval]);

  return active;
}

// ─── Animated Heading ─────────────────────────────────────────
function AnimatedHeading({ activeKey }) {
  return (
    <h1
      aria-label="The Superintelligence Cloud"
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'clamp(2.6rem, 8vw, 7.315rem)',
        fontWeight: 600,
        lineHeight: '100%',
        letterSpacing: '-0.02em',
        color: '#e7e6d9',
        margin: 0,
        padding: '0 16px',
        textAlign: 'center',
      }}
    >
      {HEADING.map((word, wi) => (
        <span key={wi}>
          {wi === 1 && ' '}
          <span style={{ whiteSpace: wi === 1 ? 'nowrap' : 'normal' }}>
            {word.split('').map((char, ci) => {
              const isActive = activeKey === `${wi}-${ci}`;
              return (
                <span
                  key={ci}
                  style={
                    isActive
                      ? {
                        fontFamily: 'var(--font-pixel)',
                        fontWeight: 300,
                        display: 'inline-block',
                        color: '#0b0b0b',
                        backgroundColor: '#e7e6d9',
                        mixBlendMode: 'screen',
                        boxShadow: 'var(--box-shadow-rgb)',
                        transition: 'all 0.12s ease',
                      }
                      : {
                        display: 'inline-block',
                        transition: 'all 0.12s ease',
                      }
                  }
                >
                  {char}
                </span>
              );
            })}
          </span>
          {wi === 1 && <br />}
        </span>
      ))}
    </h1>
  );
}



// ─── Framer Motion variants ───────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

// ─── Main Hero Component ──────────────────────────────────────
export default function WarpHero() {
  const activeKey = usePixelSwap(2500);

  return (
    <section
      id="section-home-hero"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'calc(100dvh - 100px)',
        backgroundColor: '#0b0b0b',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ── Background Animation ───────────────────────────────── */}


      {/* ── Hero Content ─────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          paddingTop: 'clamp(100px, 12vw, 160px)',
          paddingBottom: 'clamp(100px, 12vw, 160px)',
        }}
      >
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, delay: 0.3, ease: [0.6, 0, 0.4, 1] }}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            fontWeight: 600,
            lineHeight: '120%',
            color: '#e7e6d9',
            marginBottom: 20,
            padding: '0 16px',
          }}
        >
          Supercomputers for training and inference
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.9, delay: 0.55, ease: [0.6, 0, 0.4, 1] }}
        >
          <AnimatedHeading activeKey={activeKey} />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, delay: 0.85, ease: [0.6, 0, 0.4, 1] }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 18,
            justifyContent: 'center',
            marginTop: 50,
            padding: '0 16px',
          }}
        >
          <a href="/sign-up" className="btn-primary" aria-label="Launch GPU instance">Launch GPU instance</a>
          <a href="/talk-to-our-team" className="btn-secondary" aria-label="Talk to our team">Talk to our team</a>
        </motion.div>
      </div>
      <ParticlesBg className="red" />
    </section>
  );
}
