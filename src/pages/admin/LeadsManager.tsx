import { trpc } from "@/providers/trpc";
import { motion } from "framer-motion";
import { Mail, Phone, User, Clock, CheckCircle, Archive } from "lucide-react";

export default function LeadsManager() {
  const utils = trpc.useUtils();
  const { data: leads, isLoading } = trpc.contact.leads.useQuery();
  const updateStatus = trpc.contact.updateStatus.useMutation({ onSuccess: () => utils.contact.leads.invalidate() });

  const statusColors: Record<string, string> = {
    new: "bg-[#b76e79]/20 text-[#b76e79]",
    read: "bg-blue-500/20 text-blue-400",
    replied: "bg-green-500/20 text-green-400",
    archived: "bg-white/10 text-white/40",
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2 font-['Playfair_Display']">Contact Leads</h1>
      <p className="text-white/50 mb-8">Manage contact form submissions</p>

      <div className="space-y-3">
        {isLoading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="glass-card rounded-xl p-5 shimmer h-24" />) :
          leads?.length ? leads.map((lead) => (
            <motion.div key={lead.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg luxury-gradient flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-medium text-sm">{lead.name}</span>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${statusColors[lead.status]}`}>{lead.status}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-white/50 text-xs ml-11">
                    {lead.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email}</span>}
                    {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</span>}
                    {lead.serviceInterest && <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />{lead.serviceInterest}</span>}
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(lead.createdAt).toLocaleDateString()}</span>
                  </div>
                  {lead.message && <p className="text-white/60 text-sm mt-3 ml-11 p-3 rounded-lg bg-white/5">{lead.message}</p>}
                </div>
                <div className="flex gap-1 shrink-0 ml-4">
                  {lead.status === "new" && <button onClick={() => updateStatus.mutate({ id: lead.id, status: "read" })} className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs hover:bg-blue-500/30">Mark Read</button>}
                  {lead.status !== "archived" && <button onClick={() => updateStatus.mutate({ id: lead.id, status: "archived" })} className="px-3 py-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white text-xs flex items-center gap-1"><Archive className="w-3 h-3" /> Archive</button>}
                </div>
              </div>
            </motion.div>
          )) : <p className="text-white/40 text-center py-12">No leads yet</p>}
      </div>
    </div>
  );
}
