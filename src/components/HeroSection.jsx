import { useEffect, useState, useRef } from 'react';
import ParticleBackground from './ParticleBackground';

// Characters in "The Superintelligence Cloud" that get swapped to pixel font
// We target specific char indices within individual words
const HEADING_WORDS = ['The', 'Superintelligence', 'Cloud'];

// Pairs of [wordIndex, charIndex] that will cycle through highlight states
const SWAP_TARGETS = [
  [1, 0], [1, 2], [1, 5], [1, 9], [1, 13], // S, p, r, l, g in Superintelligence
  [2, 0], [2, 2], // C, o in Cloud
  [0, 0], [0, 2], // T, e in The
];

export default function HeroSection() {
  // Set of currently highlighted [wordIdx-charIdx] keys
  const [highlighted, setHighlighted] = useState(new Set());
  const cycleRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Pick 2–3 random targets to highlight each cycle
      const count = 2 + Math.floor(Math.random() * 2);
      const shuffled = [...SWAP_TARGETS].sort(() => Math.random() - 0.5).slice(0, count);
      setHighlighted(new Set(shuffled.map(([w, c]) => `${w}-${c}`)));
      cycleRef.current++;
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  function renderWord(word, wordIdx) {
    return word.split('').map((char, charIdx) => {
      const key = `${wordIdx}-${charIdx}`;
      const isHighlighted = highlighted.has(key);
      return (
        <span
          key={charIdx}
          data-variant={isHighlighted ? 'highlight' : undefined}
          style={isHighlighted ? {
            fontFamily: 'var(--font-pixel)',
            fontWeight: 300,
            color: '#0b0b0b',
            backgroundColor: '#e7e6d9',
            mixBlendMode: 'screen',
            display: 'inline-block',
            boxShadow: 'var(--box-shadow-rgb)',
            transition: 'all 0.15s ease',
          } : {
            display: 'inline-block',
            transition: 'all 0.15s ease',
          }}
        >
          {char}
        </span>
      );
    });
  }

  return (
    <section
      id="section-home-hero"
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 100px)',
        minHeight: 'calc(100dvh - 100px)',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: 'var(--color-terminal)',
        paddingTop: 'clamp(100px, 12vw, 160px)',
        paddingBottom: 'clamp(100px, 12vw, 160px)',
        overflow: 'hidden',
      }}
    >
      {/* Background particle animation */}
      <ParticleBackground />

      {/* Content layer */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>

        {/* Eyebrow */}
        <p style={{
          display: 'inline-block',
          color: '#e7e6d9',
          textAlign: 'center',
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
          fontWeight: 600,
          lineHeight: '120%',
          marginBottom: '20px',
          maxWidth: '80%',
        }}>
          Supercomputers for training and inference
        </p>

        {/* Reduced-motion fallback */}
        <h1
          className="sr-only-anim"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(2.6rem, 8vw, 7.315rem)',
            fontWeight: 600,
            lineHeight: '100%',
            letterSpacing: '-0.02em',
            color: '#e7e6d9',
            margin: 0,
            padding: '0 15px',
          }}
          aria-hidden="true"
        >
          <span style={{ display: 'block' }}>
            {HEADING_WORDS.map((word, wordIdx) => (
              <span key={wordIdx} className={wordIdx === 1 ? 'no-wrap' : ''}>
                {wordIdx > 0 && wordIdx < 2 && <> </>}
                {renderWord(word, wordIdx)}
                {wordIdx === 1 && <br />}
                {wordIdx === 2 && ''}
              </span>
            ))}
          </span>
        </h1>

        {/* Screen-reader text */}
        <span className="sr-only">The Superintelligence Cloud</span>

        {/* CTAs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'row',
          gap: '18px',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '50px',
          padding: '0 15px',
        }}>
          <a href="/sign-up" className="btn-primary" aria-label="Launch GPU instance">
            Launch GPU instance
          </a>
          <a href="/talk-to-our-team" className="btn-secondary" aria-label="Talk to our team">
            Talk to our team
          </a>
        </div>

      </div>
    </section>
  );
}
