import { motion } from "framer-motion";
import { Award, Star, Clock, Users, Heart, Plane, Home, TrendingUp } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const iconMap: Record<string, React.ReactNode> = {
  star: <Star className="w-5 h-5" />,
  heart: <Heart className="w-5 h-5" />,
  plane: <Plane className="w-5 h-5" />,
  home: <Home className="w-5 h-5" />,
  award: <Award className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  trend: <TrendingUp className="w-5 h-5" />,
  clock: <Clock className="w-5 h-5" />,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function About() {
  const { data: owner } = trpc.about.owner.useQuery();
  const { data: timeline } = trpc.about.timeline.useQuery();
  const { ref, isVisible } = useScrollAnimation(0.1);

  const achievements = (owner?.achievements as string[]) ?? [
    "500+ Bridal Makeovers",
    "Featured in Vogue Magazine",
    "Celebrity Makeup Artist",
    "International Beauty Awards Winner",
  ];

  const certificates = (owner?.certificates as string[]) ?? [
    "MAC Pro Certification",
    "Bobbi Brown Master Class",
    "Charlotte Tilbury Academy",
    "HD Makeup Specialist",
  ];

  const awards = (owner?.awards as string[]) ?? [
    "Best Bridal Makeup Artist 2025",
    "Luxury Beauty Excellence Award",
    "Top 10 Makeup Artists - Hollywood",
  ];

  const activeTimeline = timeline?.filter((t) => t.isActive) ?? [
    { id: 1, year: "2014", title: "Started Career", description: "Began journey at MAC Cosmetics flagship store", icon: "star" },
    { id: 2, year: "2016", title: "First Bridal Client", description: "Discovered true passion for bridal makeup", icon: "heart" },
    { id: 3, year: "2018", title: "Paris Training", description: "Trained under legendary artists in Paris and Milan", icon: "plane" },
    { id: 4, year: "2020", title: "Studio Launch", description: "Opened the first Mamta Makeover studio", icon: "home" },
    { id: 5, year: "2023", title: "Vogue Feature", description: "Featured in Vogue's Top Makeup Artists", icon: "award" },
    { id: 6, year: "2025", title: "1000th Client", description: "Celebrated 1000+ happy clients", icon: "users" },
  ];

  return (
    <section id="about" className="relative py-24 lg:py-32 overflow-hidden" ref={ref}>
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#b76e79]/5 to-transparent pointer-events-none" />

      <div className="section-padding relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-[#b76e79] font-medium">
            About Me
          </span>
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mt-3 font-['Playfair_Display']">
            The Artist Behind
            <span className="block luxury-gradient-text">The Brush</span>
          </h2>
        </motion.div>

        {/* Owner Profile */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24"
        >
          {/* Photo */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0">
              <div className="absolute inset-0 rounded-2xl luxury-gradient opacity-20 blur-2xl" />
              <div className="relative h-full rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={owner?.photoUrl ?? "/about/owner.jpg"}
                  alt={owner?.name ?? "Mamta"}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Experience Badge */}
              <div className="absolute -bottom-4 -right-4 glass-effect rounded-xl px-6 py-4 text-center">
                <span className="text-3xl font-bold luxury-gradient-text block">
                  {owner?.experience ?? "12+"}
                </span>
                <span className="text-xs text-white/60 uppercase tracking-wider">
                  Years Experience
                </span>
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-2xl lg:text-3xl font-bold text-white font-['Playfair_Display']">
              {owner?.name ?? "Mamta"}
            </h3>
            <p className="text-[#b76e79] font-medium">
              {owner?.title ?? "Founder & Lead Makeup Artist"}
            </p>
            <p className="text-white/70 leading-relaxed">
              {owner?.bio ??
                "With over 12 years of experience in luxury beauty and makeup artistry, I have dedicated my career to helping clients discover their most confident selves."}
            </p>

            {/* Mission & Vision */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              <div className="glass-card rounded-xl p-5">
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#b76e79]" />
                  Mission
                </h4>
                <p className="text-white/60 text-sm">
                  {owner?.mission ??
                    "To empower every individual through the transformative art of makeup."}
                </p>
              </div>
              <div className="glass-card rounded-xl p-5">
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#d4af37]" />
                  Vision
                </h4>
                <p className="text-white/60 text-sm">
                  {owner?.vision ??
                    "To be the most sought-after luxury makeup studio, known for timeless beauty."}
                </p>
              </div>
            </div>

            {/* Achievements */}
            <div className="pt-4">
              <h4 className="text-white font-semibold mb-3">Key Achievements</h4>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-white/70 text-sm"
                  >
                    <Award className="w-4 h-4 text-[#d4af37] shrink-0" />
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Certificates & Awards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-8 mb-24"
        >
          <motion.div variants={itemVariants} className="glass-card rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6 font-['Playfair_Display'] flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg luxury-gradient flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              Certifications
            </h3>
            <div className="space-y-3">
              {certificates.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                >
                  <div className="w-2 h-2 rounded-full bg-[#b76e79]" />
                  <span className="text-white/80 text-sm">{c}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6 font-['Playfair_Display'] flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg luxury-gradient flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              Awards
            </h3>
            <div className="space-y-3">
              {awards.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                >
                  <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
                  <span className="text-white/80 text-sm">{a}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-white text-center mb-12 font-['Playfair_Display']">
            My <span className="luxury-gradient-text">Journey</span>
          </h3>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#b76e79] via-[#d4af37] to-[#b76e79] md:-translate-x-px" />

            <div className="space-y-12">
              {activeTimeline.map((item, i) => (
                <motion.div
                  key={item.id ?? i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full luxury-gradient md:-translate-x-1.5 mt-1.5 ring-4 ring-[#0a0a0a]" />

                  {/* Content */}
                  <div
                    className={`ml-12 md:ml-0 md:w-1/2 ${
                      i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                    }`}
                  >
                    <div className="glass-card rounded-xl p-5 inline-block">
                      <span className="text-sm font-bold luxury-gradient-text">
                        {item.year}
                      </span>
                      <h4 className="text-white font-semibold mt-1 flex items-center gap-2">
                        {item.icon && (
                          <span className="text-[#b76e79]">
                            {iconMap[item.icon] ?? <Star className="w-4 h-4" />}
                          </span>
                        )}
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-white/60 text-sm mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
