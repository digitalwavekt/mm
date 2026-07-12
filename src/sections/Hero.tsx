import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calendar, ArrowRight, Phone } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Hero() {
  const { data: slides } = trpc.hero.list.useQuery();
  const { getSetting } = useSiteSettings();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const phone = getSetting("phone", "+1 (555) 234-5678");
  const whatsapp = getSetting("whatsapp", "+15552345678");

  const activeSlides = slides?.length
    ? slides
    : [
        {
          id: 1,
          mediaUrl: "/hero/hero-1.jpg",
          title: "Mamta Makeover",
          subtitle:
            "Where Beauty Meets Artistry. Premium Makeup Services for Every Occasion.",
          buttonText: "Book Appointment",
          buttonLink: "#contact",
          secondaryButtonText: "Explore Services",
          secondaryButtonLink: "#services",
          overlayOpacity: 60,
        },
        {
          id: 2,
          mediaUrl: "/hero/hero-2.jpg",
          title: "Bridal Glamour",
          subtitle:
            "Transform into the most beautiful version of yourself on your special day.",
          buttonText: "Book Bridal",
          buttonLink: "#contact",
          secondaryButtonText: "View Gallery",
          secondaryButtonLink: "#gallery",
          overlayOpacity: 60,
        },
        {
          id: 3,
          mediaUrl: "/hero/hero-3.jpg",
          title: "Runway Ready",
          subtitle:
            "Fashion-forward looks for editorial, runway, and special events.",
          buttonText: "Get The Look",
          buttonLink: "#contact",
          overlayOpacity: 60,
        },
      ];

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrent((prev) =>
        newDirection === 1
          ? (prev + 1) % activeSlides.length
          : (prev - 1 + activeSlides.length) % activeSlides.length
      );
    },
    [activeSlides.length]
  );

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 6000);
    return () => clearInterval(timer);
  }, [paginate]);

  const slide = activeSlides[current];

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Background Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.mediaUrl})` }}
          />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: (slide.overlayOpacity ?? 60) / 100 }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center section-padding text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base tracking-[0.3em] uppercase text-[#b76e79] mb-4 font-medium"
            >
              Premium Makeup Artistry
            </motion.p>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 text-shadow-luxury font-['Playfair_Display']">
              {slide.title}
            </h1>

            <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              {slide.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {slide.buttonText && (
                <button
                  onClick={() => scrollTo(slide.buttonLink ?? "#contact")}
                  className="btn-luxury rounded-full flex items-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  {slide.buttonText}
                </button>
              )}
              {slide.secondaryButtonText && (
                <button
                  onClick={() =>
                    scrollTo(slide.secondaryButtonLink ?? "#services")
                  }
                  className="btn-luxury-outline rounded-full flex items-center gap-2"
                >
                  {slide.secondaryButtonText}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-center gap-6 mt-8">
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/60 hover:text-[#25d366] transition-colors text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-white/60 hover:text-[#d4af37] transition-colors text-sm"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {activeSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === current
                ? "w-10 bg-gradient-to-r from-[#b76e79] to-[#d4af37]"
                : "w-5 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <button
          onClick={() => scrollTo("#about")}
          className="flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors scroll-indicator"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </button>
      </motion.div>
    </section>
  );
}
