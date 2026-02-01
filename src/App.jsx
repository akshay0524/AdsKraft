import React, { useEffect, useLayoutEffect, Suspense, lazy } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Cursor from './components/Cursor';
import Hero from './components/Hero';
import Navbar from './components/Navbar';

// Lazy load below-the-fold components
const HorizontalGallery = lazy(() => import('./components/HorizontalGallery'));
const Services = lazy(() => import('./components/Services'));
const Footer = lazy(() => import('./components/Footer'));

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [lenis, setLenis] = React.useState(null);

  useLayoutEffect(() => {
    // Force scroll to top on refresh
    window.scrollTo(0, 0);
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    // Initialize Lenis
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    setLenis(lenisInstance);

    // Synchronize Lenis with GSAP ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenisInstance.destroy();
      gsap.ticker.remove(lenisInstance.raf);
    };
  }, []);

  return (
    <div className="bg-black min-h-screen text-white selection:bg-white selection:text-black">
      <Cursor />
      <Navbar lenis={lenis} />
      <main className="w-full relative z-10">
        <Hero />
        <Suspense fallback={<div className="w-full h-screen bg-black flex items-center justify-center text-white/20">Loading...</div>}>
          <HorizontalGallery />
          <Services />
          <Footer />
        </Suspense>
      </main>
    </div>
  );
}

export default App;
