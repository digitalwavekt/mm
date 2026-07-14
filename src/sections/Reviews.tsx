import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, Send, ExternalLink } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { toast } from "sonner";

export default function Reviews() {
  const { data: reviews } = trpc.reviews.list.useQuery();
  const { data: avgRating } = trpc.reviews.average.useQuery();
  const { data: googleReviews } = trpc.googleReviews.get.useQuery();
  const submitReview = trpc.reviews.submit.useMutation({
    onSuccess: () => {
      toast.success("Review submitted! It will appear after approval.");
      setForm({ name: "", email: "", rating: 5, comment: "" });
    },
  });
  const { ref, isVisible } = useScrollAnimation(0.1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
  });
  const [showForm, setShowForm] = useState(false);

  const usingGoogle = Boolean(googleReviews?.success && googleReviews.reviews.length);

  const googleReviewList = (googleReviews?.reviews ?? []).map((r, i) => ({
    id: `google-${i}`,
    name: r.authorName,
    rating: r.rating,
    comment: r.text,
    isPinned: false,
    createdAt: r.publishTime ? new Date(r.publishTime) : null,
    adminReply: null,
    photoUrl: r.authorPhotoUrl,
    relativeTime: r.relativeTime,
    isGoogle: true as const,
  }));

  const fallbackReviewList = reviews ?? [];

  const reviewList = usingGoogle ? googleReviewList : fallbackReviewList;

  const pinned = reviewList.filter((r) => r.isPinned);
  const regular = reviewList.filter((r) => !r.isPinned);
  const displayReviews = [...pinned, ...regular].slice(0, 6);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    submitReview.mutate(form);
  };

  return (
    <section id="reviews" className="relative py-24 lg:py-32 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#d4af37]/3 to-transparent pointer-events-none" />

      <div className="section-padding relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-[#b76e79] font-medium">
            Testimonials
          </span>
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mt-3 font-['Playfair_Display']">
            Client <span className="luxury-gradient-text">Reviews</span>
          </h2>

          {usingGoogle && (
            <div className="flex items-center justify-center gap-1.5 mt-4 text-white/50 text-xs">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Live from Google Reviews
            </div>
          )}

          {/* Rating Summary */}
          {(usingGoogle || (avgRating?.count ?? 0) > 0) && (
          <div className="mt-8 inline-flex items-center gap-4 glass-card rounded-2xl px-8 py-4">
            <div className="text-center">
              <div className="text-4xl font-bold luxury-gradient-text">
                {usingGoogle && googleReviews?.rating != null
                  ? googleReviews.rating.toFixed(1)
                  : (avgRating?.average ?? "5.0")}
              </div>
              <div className="flex items-center gap-0.5 mt-1 justify-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(Number(usingGoogle && googleReviews?.rating != null ? googleReviews.rating : (avgRating?.average ?? 5)))
                        ? "text-[#d4af37] fill-[#d4af37]"
                        : "text-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-left">
              <div className="text-2xl font-bold text-white">
                {usingGoogle && googleReviews?.userRatingCount != null
                  ? googleReviews.userRatingCount
                  : (avgRating?.count ?? reviewList.length)}
              </div>
              <div className="text-white/50 text-sm">Happy Clients</div>
            </div>
          </div>
          )}

          {usingGoogle && googleReviews?.googleMapsUri && (
            <div className="mt-4">
              <a
                href={googleReviews.googleMapsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[#b76e79] hover:text-[#d4af37] transition-colors"
              >
                See all reviews on Google
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </motion.div>

        {/* Reviews Grid */}
        {displayReviews.length === 0 ? (
          <div className="text-center py-16 text-white/40 mb-4">
            No reviews yet — be the first to share your experience.
          </div>
        ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {displayReviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className={`glass-card rounded-2xl p-6 relative ${
                review.isPinned ? "ring-1 ring-[#d4af37]/30" : ""
              }`}
            >
              {review.isPinned && (
                <div className="absolute -top-3 left-6">
                  <span className="px-3 py-1 rounded-full text-xs font-medium luxury-gradient text-white">
                    Featured
                  </span>
                </div>
              )}

              <Quote className="w-8 h-8 text-[#b76e79]/20 mb-4" />

              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= review.rating
                        ? "text-[#d4af37] fill-[#d4af37]"
                        : "text-white/20"
                    }`}
                  />
                ))}
              </div>

              <p className="text-white/70 text-sm leading-relaxed mb-4">
                {review.comment}
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                {"photoUrl" in review && review.photoUrl ? (
                  <img
                    src={review.photoUrl}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full luxury-gradient flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-white font-medium text-sm block">
                    {review.name}
                  </span>
                  <span className="text-white/40 text-xs">
                    {"isGoogle" in review && review.isGoogle
                      ? review.relativeTime || "Via Google"
                      : review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : "Recent"}
                  </span>
                </div>
              </div>

              {review.adminReply && (
                <div className="mt-4 p-3 rounded-lg bg-[#b76e79]/10 border border-[#b76e79]/20">
                  <span className="text-xs text-[#b76e79] font-medium">Reply from Mamta</span>
                  <p className="text-white/60 text-xs mt-1">{review.adminReply}</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
        )}

        {/* Submit Review Button */}
        <div className="text-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-luxury-outline rounded-full"
          >
            {showForm ? "Close Form" : "Write a Review"}
          </button>
        </div>

        {/* Review Form */}
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto mt-8 glass-card rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold text-white mb-6 font-['Playfair_Display']">
              Share Your Experience
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm mb-2 block">Your Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#b76e79] transition-colors"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="text-white/70 text-sm mb-2 block">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#b76e79] transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="text-white/70 text-sm mb-2 block">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm({ ...form, rating: s })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          s <= form.rating
                            ? "text-[#d4af37] fill-[#d4af37]"
                            : "text-white/20"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-white/70 text-sm mb-2 block">Your Review *</label>
                <textarea
                  required
                  rows={4}
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#b76e79] transition-colors resize-none"
                  placeholder="Share your experience..."
                />
              </div>

              <button
                type="submit"
                disabled={submitReview.isPending}
                className="w-full btn-luxury rounded-full py-3 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {submitReview.isPending ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
}
