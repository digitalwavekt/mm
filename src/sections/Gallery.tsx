import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Filter } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const categories = ["All", "Bridal", "Party", "Fashion", "Natural", "Creative"];

export default function Gallery() {
  const { data: galleryItems } = trpc.gallery.list.useQuery();
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const { ref, isVisible } = useScrollAnimation(0.1);

  const items = galleryItems ?? [];

  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="relative py-24 lg:py-32 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#b76e79]/3 via-transparent to-transparent pointer-events-none" />

      <div className="section-padding relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-[#b76e79] font-medium">
            Portfolio
          </span>
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mt-3 font-['Playfair_Display']">
            Beauty <span className="luxury-gradient-text">Gallery</span>
          </h2>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto">
            A curated collection of transformations showcasing artistry and elegance.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-2 mb-10 flex-wrap"
        >
          <Filter className="w-4 h-4 text-white/40 mr-2" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? "luxury-gradient text-white shadow-lg shadow-[#b76e79]/20"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Masonry Grid */}
        {items.length === 0 ? (
          <div className="text-center py-16 text-white/40">
            Gallery coming soon.
          </div>
        ) : (
        <motion.div layout className="masonry-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="masonry-item group relative rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setLightbox(item.id)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title ?? "Gallery item"}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-400">
                  <span className="text-xs uppercase tracking-wider text-[#b76e79] font-medium">
                    {item.category}
                  </span>
                  <h4 className="text-white font-semibold font-['Playfair_Display']">
                    {item.title}
                  </h4>
                  {item.clientName && (
                    <span className="text-white/60 text-xs">
                      Client: {item.clientName}
                    </span>
                  )}
                </div>

                {/* Zoom Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-100 scale-75">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              onClick={() => setLightbox(null)}
            >
              <X className="w-6 h-6" />
            </button>

            {filtered.find((item) => item.id === lightbox) && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-5xl max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={filtered.find((item) => item.id === lightbox)?.imageUrl}
                  alt=""
                  className="max-w-full max-h-[85vh] object-contain rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                  <span className="text-xs uppercase tracking-wider text-[#b76e79]">
                    {filtered.find((item) => item.id === lightbox)?.category}
                  </span>
                  <h4 className="text-white font-semibold text-lg font-['Playfair_Display']">
                    {filtered.find((item) => item.id === lightbox)?.title}
                  </h4>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
