import { trpc } from "@/providers/trpc";
import { motion } from "framer-motion";
import { Star, Check, X, Pin, Trash2, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ReviewsManager() {
  const utils = trpc.useUtils();
  const { data: reviews, isLoading } = trpc.reviews.adminList.useQuery();
  const updateStatus = trpc.reviews.updateStatus.useMutation({ onSuccess: () => { utils.reviews.adminList.invalidate(); utils.reviews.list.invalidate(); utils.reviews.average.invalidate(); toast.success("Status updated"); } });
  const pinReview = trpc.reviews.pin.useMutation({ onSuccess: () => { utils.reviews.adminList.invalidate(); utils.reviews.list.invalidate(); toast.success("Pin updated"); } });
  const replyReview = trpc.reviews.reply.useMutation({ onSuccess: () => { utils.reviews.adminList.invalidate(); utils.reviews.list.invalidate(); setReplying(null); toast.success("Reply sent"); } });
  const deleteReview = trpc.reviews.delete.useMutation({ onSuccess: () => { utils.reviews.adminList.invalidate(); utils.reviews.list.invalidate(); utils.reviews.average.invalidate(); toast.success("Review deleted"); } });

  const [replying, setReplying] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2 font-['Playfair_Display']">Reviews</h1>
      <p className="text-white/50 mb-8">Manage client reviews and testimonials</p>

      <div className="space-y-3">
        {isLoading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="glass-card rounded-xl p-5 shimmer h-24" />) :
          reviews?.length ? reviews.map((review) => (
            <motion.div key={review.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full luxury-gradient flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-sm">{review.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm">{review.name}</span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`w-3 h-3 ${s <= review.rating ? "text-[#d4af37] fill-[#d4af37]" : "text-white/20"}`} />)}
                      </div>
                    </div>
                    <p className="text-white/60 text-sm mt-1">{review.comment}</p>
                    {review.adminReply && <p className="text-[#b76e79] text-xs mt-2">Reply: {review.adminReply}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className={`px-2 py-1 rounded-full text-xs ${review.status === "approved" ? "bg-green-500/20 text-green-400" : review.status === "pending" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>{review.status}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                {review.status === "pending" && (
                  <button onClick={() => updateStatus.mutate({ id: review.id, status: "approved" })} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-xs hover:bg-green-500/30 transition-colors"><Check className="w-3 h-3" /> Approve</button>
                )}
                {review.status !== "rejected" && (
                  <button onClick={() => updateStatus.mutate({ id: review.id, status: review.status === "approved" ? "pending" : "rejected" })} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-colors"><X className="w-3 h-3" /> {review.status === "approved" ? "Unapprove" : "Reject"}</button>
                )}
                <button onClick={() => pinReview.mutate({ id: review.id, isPinned: !review.isPinned })} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-colors ${review.isPinned ? "bg-[#d4af37]/20 text-[#d4af37]" : "bg-white/5 text-white/40 hover:text-white"}`}><Pin className="w-3 h-3" /> {review.isPinned ? "Unpin" : "Pin"}</button>
                <button onClick={() => { setReplying(replying === review.id ? null : review.id); setReplyText(review.adminReply ?? ""); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white text-xs"><MessageSquare className="w-3 h-3" /> Reply</button>
                <button onClick={() => { if (confirm("Delete?")) deleteReview.mutate({ id: review.id }); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-white/40 hover:text-red-400 text-xs ml-auto"><Trash2 className="w-3 h-3" /></button>
              </div>

              {replying === review.id && (
                <div className="mt-3 flex gap-2">
                  <input value={replyText} onChange={(e) => setReplyText(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" placeholder="Write a reply..." />
                  <button onClick={() => replyReview.mutate({ id: review.id, adminReply: replyText })} disabled={!replyText.trim()} className="btn-luxury rounded-lg px-4 py-2 text-xs disabled:opacity-50">Send</button>
                </div>
              )}
            </motion.div>
          )) : <p className="text-white/40 text-center py-12">No reviews yet</p>}
      </div>
    </div>
  );
}
