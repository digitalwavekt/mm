import { trpc } from "@/providers/trpc";
import { motion } from "framer-motion";
import { Mail, Users, Trash2, Download } from "lucide-react";
import { toast } from "sonner";

export default function NewsletterManager() {
  const utils = trpc.useUtils();
  const { data: subscribers, isLoading } = trpc.contact.subscribers.useQuery();
  const deleteSubscriber = trpc.contact.deleteSubscriber.useMutation({
    onSuccess: () => { utils.contact.subscribers.invalidate(); toast.success("Subscriber removed"); },
  });

  const handleExport = () => {
    if (!subscribers?.length) { toast.error("No subscribers to export"); return; }
    const csv = "Email,Subscribed On\n" + subscribers.map((s) => `${s.email},${new Date(s.createdAt).toLocaleDateString()}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "subscribers.csv"; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-['Playfair_Display']">Newsletter</h1>
          <p className="text-white/50">Manage subscribers</p>
        </div>
        <button onClick={handleExport} className="btn-luxury-outline rounded-full px-6 py-3 flex items-center gap-2 text-sm">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl luxury-gradient flex items-center justify-center">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{subscribers?.length ?? 0}</p>
            <p className="text-white/50 text-sm">Total Subscribers</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {isLoading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="glass-card rounded-xl p-4 shimmer h-14" />) :
          subscribers?.length ? subscribers.map((sub) => (
            <motion.div key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[#b76e79]" />
                </div>
                <span className="text-white text-sm">{sub.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/40 text-xs">{new Date(sub.createdAt).toLocaleDateString()}</span>
                <button onClick={() => { if (confirm("Remove subscriber?")) deleteSubscriber.mutate({ id: sub.id }); }} className="w-7 h-7 rounded bg-white/5 flex items-center justify-center hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )) : <p className="text-white/40 text-center py-12">No subscribers yet</p>}
      </div>
    </div>
  );
}
