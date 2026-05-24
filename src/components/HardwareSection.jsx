import { useState } from 'react';

const PRODUCTS = [
  {
    title: 'NVIDIA VR200 NVL72',
    description: 'Rack-scale systems optimized for agentic AI.',
    image: 'https://lambda.ai/hubfs/VR200.jpg',
    bgColor: '#1a1020',
    accentColor: '#6236f4',
  },
  {
    title: 'NVIDIA GB300 NVL72',
    description: 'Rack-scale systems optimized for AI reasoning',
    image: 'https://lambda.ai/hubfs/gb300.png',
    bgColor: '#0a1520',
    accentColor: '#00e6d9',
  },
  {
    title: 'NVIDIA HGX B300',
    description: 'Peak performance per watt for the largest training runs',
    image: 'https://lambda.ai/hubfs/NVIDIA%20HGX%20B300%20(1).png',
    bgColor: '#101520',
    accentColor: '#815ef6',
  },
  {
    title: 'NVIDIA HGX B200',
    description: 'Versatile fine-tuning and inference',
    image: 'https://lambda.ai/hubfs/b200.png',
    bgColor: '#150a10',
    accentColor: '#e7e6d9',
  },
];



export default function HardwareSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section style={{ backgroundColor: '#000000', paddingTop: 'clamp(80px, 10vw, 160px)' }}>
      <div style={{ maxWidth: 1398, margin: '0 auto', padding: '0 15px' }}>

        {/* Title block — two columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 32,
          marginBottom: 60,
        }}
          className="hardware-title-block"
        >
          <h2
            className="hardware-heading"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 600,
              lineHeight: '110%',
              letterSpacing: '-0.02em',
              color: '#e7e6d9',
              margin: 0,
            }}
          >
            The engines of<br />superintelligence
          </h2>
          <p
            className="hardware-subtitle"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem',
              color: '#e7e6d9',
              lineHeight: '150%',
              margin: 0,
              maxWidth: 520,
            }}
          >
            Give your team the computational precision to train foundation models and serve inference at global scale.
          </p>
        </div>

      </div>

      {/* Horizontal accordion — full width */}
      <div
        className="hardware-cards"
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          height: 610,
          gap: 16,
          overflow: 'hidden',
          padding: "0 15px"
        }}
      >
        {PRODUCTS.map((product, i) => {
          const isActive = activeIdx === i;
          return (
            <button
              key={i}
              type="button"
              aria-expanded={isActive}
              onClick={() => setActiveIdx(i)}
              className={`hardware-card${isActive ? ' active' : ''}`}
              style={{
                position: 'relative',
                flex: isActive ? '0 0 42.5%' : '0 0 18%',
                height: '100%',
                cursor: 'pointer',
                background: '#0a0a0a',
                border: '1px solid #262625',
                padding: 0,
                overflow: 'hidden',
                transition: 'flex 0.4s cubic-bezier(.6,0,.4,1)',
                outline: 'none',
              }}
            >
              {/* GPU top image */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: isActive ? '80%' : '60%',
                opacity: isActive ? 1 : 1,
                transition: 'all 0.4s ease',
              }}>
                <img
                  src={product.image}
                  alt={product.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    filter: isActive ? 'none' : 'grayscale(100%)',
                    transition: 'filter 0.4s ease',
                  }}
                />
              </div>

              {/* Gradient overlay bottom */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: isActive ? '60%' : '50%',
                background: 'linear-gradient(to top, rgba(10,10,10,1) 40%, rgba(10,10,10,0.8) 80%, transparent 100%)',
                zIndex: 1,
              }} />

              {/* Text content anchored to bottom */}
              <div style={{
                position: 'absolute',
                bottom: isActive ? '20%' : 0,
                left: 0,
                right: 0,
                padding: '24px 28px 32px',
                zIndex: 2,
                textAlign: 'left',
                transition: 'bottom 0.4s ease',
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: isActive ? 'clamp(1.2rem, 2vw, 1.5rem)' : 'clamp(0.85rem, 1.2vw, 1.1rem)',
                  fontWeight: 600,
                  color: '#e7e6d9',
                  margin: '0 0 8px',
                  letterSpacing: '-0.01em',
                  whiteSpace: isActive ? 'normal' : 'nowrap',
                  overflow: isActive ? 'visible' : 'hidden',
                  textOverflow: isActive ? 'unset' : 'ellipsis',
                  transition: 'font-size 0.4s ease',
                }}>
                  {product.title}
                </h3>

                {/* Description — fades in when active */}
                <div
                  className="hardware-card-desc"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'translateY(0)' : 'translateY(16px)',
                    transition: 'opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.875rem',
                    color: '#b0afa6',
                    lineHeight: '150%',
                    maxWidth: '100%',
                    marginTop: '45px',
                  }}
                >
                  {product.description}
                </div>
              </div>

              {/* Bottom indicator bar */}
              <div
                className="hardware-card-indicator"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 7,
                  background: isActive ? '#6236f4' : '#e7e6d9',
                  transition: 'background 0.4s ease',
                  zIndex: 3,
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Responsive styles */}
      <style>{`
        .hardware-card{mix-blend-mode: luminosity;}
        .hardware-card.active{mix-blend-mode: unset;}
        @media (min-width: 1024px) {
          .hardware-card img {object-fit: cover; width: 410px !important; height: 410px !important; flex-shrink: 0; aspect-ratio: 1 / 1;margin:0 auto;}
        }
        @media (min-width: 768px) {
          .hardware-title-block {
            grid-template-columns: 58% 42% !important;
            align-items: start;
          }
          .hardware-subtitle {
            padding-top: 40px;
          }
        }
        @media (max-width: 767px) {
          .hardware-cards {
            flex-direction: column !important;
            height: auto !important;
          }
          .hardware-card {
            flex: none !important;
            width: 100% !important;
            min-height: 300px;
            border-bottom: 1px solid #262625;
          }
          .hardware-card-desc {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
