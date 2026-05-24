import './index.css';
import WarpHero from './components/WarpHero';
import FeaturesSection from './components/FeaturesSection';
import HardwareSection from './components/HardwareSection';
import AccordionLevelAnimation from './components/AccordionLevelAnimation';

export default function App() {
  return (
    <main>
      <WarpHero />
      {/* <FeaturesSection /> */}
      <AccordionLevelAnimation />
      <HardwareSection />
    </main>
  );
}
