import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";
import FloatingButtons from "@/components/FloatingButtons";
import MobileStickyFooter from "@/components/MobileStickyFooter";
import Hero from "@/sections/Hero";
import About from "@/sections/About";
import Services from "@/sections/Services";
import Gallery from "@/sections/Gallery";
import Reviews from "@/sections/Reviews";
import Offers from "@/sections/Offers";
import Contact from "@/sections/Contact";
import Footer from "@/sections/Footer";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    // Show content after loading screen starts fading
    const timer = setTimeout(() => setContentVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && (
        <LoadingScreen onComplete={() => setLoading(false)} />
      )}

      {contentVisible && (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
          <Navbar />
          <main>
            <Hero />
            <About />
            <Services />
            <Gallery />
            <Offers />
            <Reviews />
            <Contact />
          </main>
          <Footer />
          <FloatingButtons />
          <MobileStickyFooter />
        </div>
      )}
    </>
  );
}
