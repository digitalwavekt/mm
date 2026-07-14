import { motion } from "framer-motion";
import { Tag, Clock, ArrowRight } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function Offers() {
  const { data: offers } = trpc.ads.offers.useQuery();
  const { ref, isVisible } = useScrollAnimation(0.1);

  const activeOffers = offers ?? [];

  if (activeOffers.length === 0) return null;

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#b76e79]/3 to-transparent pointer-events-none" />

      <div className="section-padding relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-[#b76e79] font-medium">
            Limited Time
          </span>
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mt-3 font-['Playfair_Display']">
            Special <span className="luxury-gradient-text">Offers</span>
          </h2>
        </motion.div>

        {/* Offers Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {activeOffers.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              className="glass-card rounded-2xl overflow-hidden group glow-border"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={offer.imageUrl ?? ""}
                  alt={offer.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                
                {/* Discount Badge */}
                {offer.discountPercent && (
                  <div className="absolute top-4 left-4">
                    <div className="luxury-gradient rounded-full w-14 h-14 flex flex-col items-center justify-center">
                      <span className="text-white font-bold text-lg leading-none">
                        {offer.discountPercent}%
                      </span>
                      <span className="text-white/80 text-[10px] uppercase">OFF</span>
                    </div>
                  </div>
                )}

                {/* Valid Until */}
                <div className="absolute top-4 right-4">
                  <div className="glass-effect rounded-full px-3 py-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#b76e79]" />
                    <span className="text-white text-xs">
                      {offer.validUntil
                        ? `Until ${new Date(offer.validUntil).toLocaleDateString()}`
                        : "Limited Time"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 font-['Playfair_Display']">
                  {offer.title}
                </h3>
                <p className="text-white/60 text-sm mb-4">{offer.description}</p>

                {offer.couponCode && (
                  <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-[#b76e79]/10 border border-[#b76e79]/20">
                    <Tag className="w-4 h-4 text-[#b76e79]" />
                    <span className="text-white/60 text-xs">Use code:</span>
                    <span className="text-[#d4af37] font-bold text-sm tracking-wider">
                      {offer.couponCode}
                    </span>
                  </div>
                )}

                <button
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="w-full btn-luxury rounded-full py-3 text-sm flex items-center justify-center gap-2"
                >
                  {offer.ctaText ?? "Claim Offer"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
