import { motion } from "framer-motion";
import {
  Sparkles,
  Camera,
  Star,
  Mail,
  Users,
  Gift,
  Image,
  TrendingUp,
} from "lucide-react";
import { trpc } from "@/providers/trpc";

const statIcons: Record<string, React.ReactNode> = {
  totalServices: <Sparkles className="w-6 h-6" />,
  totalGallery: <Camera className="w-6 h-6" />,
  totalReviews: <Star className="w-6 h-6" />,
  totalLeads: <Mail className="w-6 h-6" />,
  totalSubscribers: <Users className="w-6 h-6" />,
  totalOffers: <Gift className="w-6 h-6" />,
  totalMedia: <Image className="w-6 h-6" />,
  totalHeroSlides: <Image className="w-6 h-6" />,
  totalAds: <TrendingUp className="w-6 h-6" />,
  totalUsers: <Users className="w-6 h-6" />,
};

const statLabels: Record<string, string> = {
  totalServices: "Services",
  totalGallery: "Gallery Items",
  totalReviews: "Reviews",
  totalLeads: "Contact Leads",
  totalSubscribers: "Subscribers",
  totalOffers: "Offers",
  totalMedia: "Media Files",
  totalHeroSlides: "Hero Slides",
  totalAds: "Advertisements",
  totalUsers: "Users",
};

export default function AdminDashboard() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();
  const { data: activity } = trpc.dashboard.recentActivity.useQuery();

  const statEntries = stats
    ? Object.entries(stats).filter(([key]) => key !== "averageRating")
    : [];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white font-['Playfair_Display']">
          Dashboard
        </h1>
        <p className="text-white/50 mt-1">Overview of your website</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="glass-card rounded-xl p-5 shimmer h-28"
              />
            ))
          : statEntries.map(([key, value], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-xl p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/50 text-sm mb-1">
                      {statLabels[key] ?? key}
                    </p>
                    <p className="text-2xl font-bold text-white">{value as number}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl luxury-gradient/20 flex items-center justify-center text-[#b76e79]">
                    {statIcons[key]}
                  </div>
                </div>
              </motion.div>
            ))}
      </div>

      {/* Rating */}
      {stats?.averageRating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-6 mb-8 inline-flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-xl luxury-gradient flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{stats.averageRating}</span>
          </div>
          <div>
            <p className="text-white font-semibold">Average Rating</p>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= Math.round(Number(stats.averageRating))
                      ? "text-[#d4af37] fill-[#d4af37]"
                      : "text-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-4 font-['Playfair_Display']">
            Recent Contact Leads
          </h2>
          <div className="space-y-3">
            {activity?.recentLeads?.length ? (
              activity.recentLeads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                >
                  <div>
                    <p className="text-white text-sm font-medium">{lead.name}</p>
                    <p className="text-white/40 text-xs">{lead.serviceInterest ?? "General inquiry"}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      lead.status === "new"
                        ? "bg-[#b76e79]/20 text-[#b76e79]"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-white/40 text-sm">No recent leads</p>
            )}
          </div>
        </motion.div>

        {/* Recent Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-4 font-['Playfair_Display']">
            Recent Reviews
          </h2>
          <div className="space-y-3">
            {activity?.recentReviews?.length ? (
              activity.recentReviews.slice(0, 5).map((review) => (
                <div
                  key={review.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                >
                  <div>
                    <p className="text-white text-sm font-medium">{review.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= review.rating
                              ? "text-[#d4af37] fill-[#d4af37]"
                              : "text-white/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      review.status === "approved"
                        ? "bg-green-500/20 text-green-400"
                        : review.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {review.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-white/40 text-sm">No recent reviews</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
