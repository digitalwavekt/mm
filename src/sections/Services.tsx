import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, DollarSign, Check, Sparkles } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export default function Services() {
  const { data: services } = trpc.services.list.useQuery();
  const [selectedService, setSelectedService] = useState<(typeof servicesList)[0] | null>(null);
  const { ref, isVisible } = useScrollAnimation(0.1);

  const servicesList = services?.length
    ? services
    : [
        {
          id: 1,
          name: "Bridal Makeup",
          slug: "bridal-makeup",
          shortDescription: "Flawless, long-lasting bridal glamour for your special day",
          description: "Our signature bridal makeup service is designed to make you look and feel absolutely radiant on your wedding day. Using premium, long-lasting products, we create a customized look that photographs beautifully.",
          imageUrl: "/services/bridal.jpg",
          price: "350.00",
          duration: "2-3 hours",
          category: "Bridal",
          benefits: ["HD Photoshoot-Ready Finish", "Waterproof & Long-Lasting", "Bridal Trial Included", "Touch-up Kit Provided"],
          preparation: "Please arrive with clean, moisturized face.",
          afterCare: "Use gentle cleanser. Avoid touching face.",
        },
        {
          id: 2,
          name: "Party Glam",
          slug: "party-glam",
          shortDescription: "Stunning evening and party makeup looks",
          description: "Turn heads at your next event with our Party Glam service. From subtle sophistication to bold and dramatic.",
          imageUrl: "/services/party.jpg",
          price: "150.00",
          duration: "1 hour",
          category: "Party",
          benefits: ["Smudge-Proof Application", "Custom Color Matching", "Long-Wear Formula", "Lashes Included"],
        },
        {
          id: 3,
          name: "Editorial Makeup",
          slug: "editorial-makeup",
          shortDescription: "High-fashion looks for photoshoots and runway",
          description: "Editorial and fashion-forward makeup for magazine shoots, runway shows, and creative projects.",
          imageUrl: "/services/editorial.jpg",
          price: "400.00",
          duration: "2-3 hours",
          category: "Fashion",
          benefits: ["HD Camera-Ready", "Creative Direction", "Full Product Kit", "On-Set Touch-ups"],
        },
        {
          id: 4,
          name: "Natural Everyday",
          slug: "natural-everyday",
          shortDescription: "Effortless, natural beauty enhancement",
          description: "Enhance your natural beauty with a fresh, dewy look perfect for everyday wear.",
          imageUrl: "/services/natural.jpg",
          price: "100.00",
          duration: "45 min",
          category: "Daily",
          benefits: ["Skin-Like Finish", "Lightweight Formula", "Quick Application", "Natural Glow"],
        },
        {
          id: 5,
          name: "Special Effects",
          slug: "special-effects",
          shortDescription: "Creative SFX makeup for events and productions",
          description: "Transformative special effects makeup for Halloween, themed events, film, and theater.",
          imageUrl: "/services/sfx.jpg",
          price: "300.00",
          duration: "2-4 hours",
          category: "Creative",
          benefits: ["Professional Grade Products", "Custom Design", "Safe Removal", "Long-Lasting"],
        },
        {
          id: 6,
          name: "Makeup Lessons",
          slug: "makeup-lessons",
          shortDescription: "One-on-one makeup masterclasses",
          description: "Learn professional techniques in personalized one-on-one sessions.",
          imageUrl: "/services/lessons.jpg",
          price: "200.00",
          duration: "2 hours",
          category: "Education",
          benefits: ["Personalized Curriculum", "Take-Home Notes", "Product Recommendations", "Hands-On Practice"],
        },
      ];

  return (
    <section id="services" className="relative py-24 lg:py-32 overflow-hidden" ref={ref}>
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
            What I Offer
          </span>
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mt-3 font-['Playfair_Display']">
            Premium <span className="luxury-gradient-text">Services</span>
          </h2>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto">
            From bridal glamour to editorial artistry, every service is tailored
            to enhance your unique beauty.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {servicesList.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="group glass-card rounded-2xl overflow-hidden cursor-pointer glow-border"
              onClick={() => setSelectedService(service)}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={service.imageUrl ?? "/services/bridal.jpg"}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm text-white border border-white/20">
                    {service.category}
                  </span>
                </div>

                {/* Price */}
                <div className="absolute bottom-4 right-4">
                  <span className="text-xl font-bold luxury-gradient-text">
                    ${service.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 font-['Playfair_Display'] group-hover:text-[#b76e79] transition-colors">
                  {service.name}
                </h3>
                <p className="text-white/60 text-sm mb-4 line-clamp-2">
                  {service.shortDescription}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-white/40 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{service.duration}</span>
                  </div>
                  <span className="flex items-center gap-1 text-[#b76e79] text-sm font-medium group-hover:gap-2 transition-all">
                    Details
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Service Detail Dialog */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-2xl bg-[#111] border-white/10 text-white max-h-[90vh] overflow-y-auto">
          {selectedService && (
            <>
              <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
                <img
                  src={selectedService.imageUrl ?? ""}
                  alt={selectedService.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#b76e79]">
                      {selectedService.category}
                    </span>
                    <h2 className="text-2xl font-bold font-['Playfair_Display']">
                      {selectedService.name}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold luxury-gradient-text">
                      ${selectedService.price}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-white/70 leading-relaxed">
                  {selectedService.description}
                </p>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-white/60">
                    <Clock className="w-4 h-4 text-[#d4af37]" />
                    <span>{selectedService.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <DollarSign className="w-4 h-4 text-[#d4af37]" />
                    <span>From ${selectedService.price}</span>
                  </div>
                </div>

                {selectedService.benefits && (
                  <div>
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#b76e79]" />
                      What's Included
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {(selectedService.benefits as string[]).map((b, i) => (
                        <div key={i} className="flex items-center gap-2 text-white/70 text-sm">
                          <Check className="w-4 h-4 text-[#d4af37] shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedService.preparation || selectedService.afterCare) && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {selectedService.preparation && (
                      <div className="glass-card rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-2 text-sm">Preparation</h4>
                        <p className="text-white/60 text-xs">{selectedService.preparation}</p>
                      </div>
                    )}
                    {selectedService.afterCare && (
                      <div className="glass-card rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-2 text-sm">After Care</h4>
                        <p className="text-white/60 text-xs">{selectedService.afterCare}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSelectedService(null);
                      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex-1 btn-luxury rounded-full py-3 text-sm"
                  >
                    Book This Service
                  </button>
                  <a
                    href={`https://wa.me/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full border border-[#25d366] text-[#25d366] hover:bg-[#25d366] hover:text-white transition-all text-sm font-medium"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
