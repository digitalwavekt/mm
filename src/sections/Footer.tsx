import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Instagram, Facebook, Youtube, MapPin, Phone, Mail, Sparkles } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "sonner";
import Logo from "@/components/Logo";

export default function Footer() {
  const { getSetting } = useSiteSettings();
  const subscribe = trpc.contact.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Successfully subscribed to newsletter!");
      setEmail("");
    },
  });
  const [email, setEmail] = useState("");

  const siteName = getSetting("siteName", "Mamta Makeover");
  const tagline = getSetting("tagline", "Where Beauty Meets Artistry");
  const address = getSetting("address", "123 Luxury Lane, Beverly Hills, CA 90210");
  const phone = getSetting("phone", "+1 (555) 234-5678");
  const emailSetting = getSetting("email", "hello@mamtamakeover.com");
  const copyright = getSetting("copyright", "2026 Mamta Makeover. All rights reserved.");
  const developerCredit = getSetting("developerCredit", "Developed by KT");
  const developerContact = getSetting("developerContact", "https://kt.digitalwaveitsolution.online");
  const instagram = getSetting("instagram", "https://instagram.com/mamtamakeover");
  const facebook = getSetting("facebook", "https://facebook.com/mamtamakeover");
  const youtube = getSetting("youtube", "https://youtube.com/@mamtamakeover");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    subscribe.mutate({ email });
  };

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Gallery", href: "#gallery" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ];

  const services = [
    "Bridal Makeup",
    "Party Glam",
    "Editorial Makeup",
    "Natural Everyday",
    "Special Effects",
    "Makeup Lessons",
  ];

  return (
    <footer className="relative pt-24 pb-28 lg:pb-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-[#0a0a0a] to-transparent" />

      <div className="section-padding relative z-10">
        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-8 lg:p-12 mb-16 text-center"
        >
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 font-['Playfair_Display']">
            Join the <span className="luxury-gradient-text">Inner Circle</span>
          </h3>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            Subscribe for exclusive beauty tips, early access to offers, and behind-the-scenes content.
          </p>
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#b76e79] transition-colors"
            />
            <button
              type="submit"
              disabled={subscribe.isPending}
              className="btn-luxury rounded-full px-6 py-3 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Subscribe
            </button>
          </form>
        </motion.div>

        {/* Footer Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Logo size="md" />
              <span className="text-lg font-semibold luxury-gradient-text">
                {siteName}
              </span>
            </div>
            <p className="text-white/60 text-sm mb-6">{tagline}</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <MapPin className="w-4 h-4 text-[#b76e79] shrink-0" />
                <span>{address}</span>
              </div>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 text-white/60 text-sm hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-[#b76e79] shrink-0" />
                <span>{phone}</span>
              </a>
              <a
                href={`mailto:${emailSetting}`}
                className="flex items-center gap-3 text-white/60 text-sm hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#b76e79] shrink-0" />
                <span>{emailSetting}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="block text-white/60 hover:text-[#b76e79] transition-colors text-sm"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Services
            </h4>
            <div className="space-y-2">
              {services.map((service) => (
                <button
                  key={service}
                  onClick={() => scrollTo("#services")}
                  className="block text-white/60 hover:text-[#b76e79] transition-colors text-sm"
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Follow Us
            </h4>
            <div className="flex gap-3">
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-white/60 hover:text-[#b76e79] hover:border-[#b76e79]/30 transition-all"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-white/60 hover:text-[#b76e79] hover:border-[#b76e79]/30 transition-all"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {youtube && (
                <a
                  href={youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-white/60 hover:text-[#b76e79] hover:border-[#b76e79]/30 transition-all"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8">
          <div className="flex flex-col items-center gap-5 text-center">
            <p className="text-white/40 text-sm">{copyright}</p>
            {developerCredit && (
              <a
                href={developerContact}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-gradient-to-r from-[#d4af37] via-[#f4e2a4] to-[#d4af37] text-black text-sm font-semibold shadow-lg shadow-[#d4af37]/30 hover:shadow-[#d4af37]/50 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <Sparkles className="w-4 h-4" />
                {developerCredit}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
