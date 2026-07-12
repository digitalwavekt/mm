import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Sparkles, Gift, Phone, X, MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function MobileStickyFooter() {
  const [visible, setVisible] = useState(false);
  const [showCallOptions, setShowCallOptions] = useState(false);
  const { getSetting } = useSiteSettings();

  const phone = getSetting("phone", "+1 (555) 234-5678");
  const whatsapp = getSetting("whatsapp", "+15552345678");

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500 && window.innerWidth < 1024);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: "Home", action: () => scrollTo("home") },
    { icon: <Sparkles className="w-5 h-5" />, label: "Services", action: () => scrollTo("services") },
    { icon: <Gift className="w-5 h-5" />, label: "Offers", action: () => scrollTo("contact") },
    { icon: <MessageCircle className="w-5 h-5" />, label: "Contact", action: () => scrollTo("contact") },
  ];

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
          >
            <div className="glass-effect border-t border-white/10 px-4 py-2 pb-safe">
              <div className="flex items-center justify-around">
                {navItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={item.action}
                    className="flex flex-col items-center gap-1 py-2 px-3 text-white/60 hover:text-white transition-colors"
                  >
                    {item.icon}
                    <span className="text-[10px]">{item.label}</span>
                  </button>
                ))}

                {/* Center Call Button */}
                <button
                  onClick={() => setShowCallOptions(!showCallOptions)}
                  className="relative -mt-6"
                >
                  <div className="w-14 h-14 rounded-full luxury-gradient flex items-center justify-center shadow-lg shadow-[#b76e79]/30 animate-pulse">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call Options Overlay */}
      <AnimatePresence>
        {showCallOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex items-end justify-center pb-24"
            onClick={() => setShowCallOptions(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-[#111] rounded-2xl p-6 w-full max-w-sm mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Contact Options</h3>
                <button
                  onClick={() => setShowCallOptions(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="space-y-3">
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 p-4 rounded-xl glass-card hover:bg-white/[0.07] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg luxury-gradient flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-white font-medium block">Call Now</span>
                    <span className="text-white/50 text-sm">{phone}</span>
                  </div>
                </a>
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl glass-card hover:bg-white/[0.07] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#25d366] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-white font-medium block">WhatsApp</span>
                    <span className="text-white/50 text-sm">Chat with us</span>
                  </div>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
