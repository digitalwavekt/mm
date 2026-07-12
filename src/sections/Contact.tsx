import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, Calendar } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { toast } from "sonner";

export default function Contact() {
  const { getSetting } = useSiteSettings();
  const submitLead = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Message sent successfully! We will contact you soon.");
      setForm({ name: "", email: "", phone: "", serviceInterest: "", message: "" });
    },
  });
  const { ref, isVisible } = useScrollAnimation(0.1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceInterest: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    submitLead.mutate(form);
  };

  const phone = getSetting("phone", "+1 (555) 234-5678");
  const whatsapp = getSetting("whatsapp", "+15552345678");
  const email = getSetting("email", "hello@mamtamakeover.com");
  const address = getSetting("address", "123 Luxury Lane, Beverly Hills, CA 90210");
  const workingHours = getSetting("workingHours", "Mon-Sat: 9AM - 8PM | Sunday: 10AM - 6PM");
  const googleMap = getSetting("googleMap", "https://maps.google.com/?q=Beverly+Hills+CA");

  const contactInfo = [
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Address",
      value: address,
      href: googleMap,
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Phone",
      value: phone,
      href: `tel:${phone.replace(/\s/g, "")}`,
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      label: "WhatsApp",
      value: whatsapp,
      href: `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Working Hours",
      value: workingHours,
    },
  ];

  return (
    <section id="contact" className="relative py-24 lg:py-32 overflow-hidden" ref={ref}>
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
            Get In Touch
          </span>
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mt-3 font-['Playfair_Display']">
            Book Your <span className="luxury-gradient-text">Appointment</span>
          </h2>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto">
            Ready to transform your look? Book your appointment today and experience
            luxury beauty artistry.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 font-['Playfair_Display']">
                Send a Message
              </h3>

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/70 text-sm mb-2 block">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#b76e79] transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-white/70 text-sm mb-2 block">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#b76e79] transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/70 text-sm mb-2 block">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#b76e79] transition-colors"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div>
                    <label className="text-white/70 text-sm mb-2 block">
                      Interested Service
                    </label>
                    <select
                      value={form.serviceInterest}
                      onChange={(e) =>
                        setForm({ ...form, serviceInterest: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#b76e79] transition-colors appearance-none"
                    >
                      <option value="" className="bg-[#111]">
                        Select a service
                      </option>
                      <option value="Bridal Makeup" className="bg-[#111]">
                        Bridal Makeup
                      </option>
                      <option value="Party Glam" className="bg-[#111]">
                        Party Glam
                      </option>
                      <option value="Editorial" className="bg-[#111]">
                        Editorial Makeup
                      </option>
                      <option value="Natural" className="bg-[#111]">
                        Natural Everyday
                      </option>
                      <option value="SFX" className="bg-[#111]">
                        Special Effects
                      </option>
                      <option value="Lessons" className="bg-[#111]">
                        Makeup Lessons
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-white/70 text-sm mb-2 block">Message</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#b76e79] transition-colors resize-none"
                    placeholder="Tell me about your event..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitLead.isPending}
                  className="w-full btn-luxury rounded-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitLead.isPending ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((item, i) => (
                <motion.a
                  key={i}
                  href={item.href}
                  target={item.href?.startsWith("http") ? "_blank" : undefined}
                  rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 * i }}
                  className="flex items-start gap-4 glass-card rounded-xl p-5 group hover:bg-white/[0.07] transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl luxury-gradient flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <span className="text-white">{item.icon}</span>
                  </div>
                  <div>
                    <span className="text-white/50 text-xs uppercase tracking-wider">
                      {item.label}
                    </span>
                    <p className="text-white font-medium mt-0.5">{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="btn-luxury rounded-xl py-4 text-center flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl py-4 border border-[#25d366] text-[#25d366] hover:bg-[#25d366] hover:text-white transition-all font-medium text-sm"
              >
                <Calendar className="w-4 h-4" />
                WhatsApp
              </a>
            </div>

            {/* Map Embed */}
            <div className="rounded-xl overflow-hidden border border-white/10 aspect-video">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.715220363292!2d-118.4005473!3d34.0736203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d14723%3A0xd6cac5b8a0b7d39c!2sBeverly%20Hills%2C%20CA%2090210!5e0!3m2!1sen!2sus!4v1`}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
