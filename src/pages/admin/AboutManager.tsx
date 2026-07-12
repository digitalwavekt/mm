import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, Pencil } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";

export default function AboutManager() {
  const utils = trpc.useUtils();
  const { data: owner } = trpc.about.adminOwner.useQuery();
  const { data: timeline } = trpc.about.adminTimeline.useQuery();
  const upsertOwner = trpc.about.upsertOwner.useMutation({
    onSuccess: () => { utils.about.adminOwner.invalidate(); toast.success("Owner info saved"); },
  });
  const createTimeline = trpc.about.createTimeline.useMutation({
    onSuccess: () => { utils.about.adminTimeline.invalidate(); setShowTimelineForm(false); toast.success("Timeline entry added"); },
  });
  const updateTimeline = trpc.about.updateTimeline.useMutation({
    onSuccess: () => { utils.about.adminTimeline.invalidate(); setEditingTimeline(null); toast.success("Timeline updated"); },
  });
  const deleteTimeline = trpc.about.deleteTimeline.useMutation({
    onSuccess: () => { utils.about.adminTimeline.invalidate(); toast.success("Timeline deleted"); },
  });

  const [ownerForm, setOwnerForm] = useState({
    name: "", title: "", photoUrl: "", bio: "", experience: "",
    mission: "", vision: "", achievements: "", certificates: "", awards: "",
  });

  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState<number | null>(null);
  const [timelineForm, setTimelineForm] = useState({ year: "", title: "", description: "", icon: "star", sortOrder: 0 });

  useEffect(() => {
    if (owner) {
      setOwnerForm({
        name: owner.name ?? "",
        title: owner.title ?? "",
        photoUrl: owner.photoUrl ?? "",
        bio: owner.bio ?? "",
        experience: owner.experience ?? "",
        mission: owner.mission ?? "",
        vision: owner.vision ?? "",
        achievements: (owner.achievements as string[])?.join("\n") ?? "",
        certificates: (owner.certificates as string[])?.join("\n") ?? "",
        awards: (owner.awards as string[])?.join("\n") ?? "",
      });
    }
  }, [owner]);

  const handleSaveOwner = (e: React.FormEvent) => {
    e.preventDefault();
    upsertOwner.mutate({
      name: ownerForm.name,
      title: ownerForm.title || undefined,
      photoUrl: ownerForm.photoUrl || undefined,
      bio: ownerForm.bio || undefined,
      experience: ownerForm.experience || undefined,
      mission: ownerForm.mission || undefined,
      vision: ownerForm.vision || undefined,
      achievements: ownerForm.achievements.split("\n").filter(Boolean),
      certificates: ownerForm.certificates.split("\n").filter(Boolean),
      awards: ownerForm.awards.split("\n").filter(Boolean),
    });
  };

  const handleTimelineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTimeline) {
      updateTimeline.mutate({ id: editingTimeline, ...timelineForm });
    } else {
      createTimeline.mutate(timelineForm);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2 font-['Playfair_Display']">About Manager</h1>
      <p className="text-white/50 mb-8">Manage owner profile and journey timeline</p>

      {/* Owner Form */}
      <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSaveOwner} className="glass-card rounded-xl p-6 mb-8">
        <h3 className="text-lg font-bold text-white mb-4">Owner Profile</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-white/60 text-sm mb-1 block">Name *</label>
            <input required value={ownerForm.name} onChange={(e) => setOwnerForm({ ...ownerForm, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1 block">Title</label>
            <input value={ownerForm.title} onChange={(e) => setOwnerForm({ ...ownerForm, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-white/60 text-sm mb-1 block">Photo URL</label>
            <input value={ownerForm.photoUrl} onChange={(e) => setOwnerForm({ ...ownerForm, photoUrl: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" placeholder="/about/owner.jpg" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-white/60 text-sm mb-1 block">Bio</label>
            <textarea rows={3} value={ownerForm.bio} onChange={(e) => setOwnerForm({ ...ownerForm, bio: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none" />
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1 block">Experience</label>
            <input value={ownerForm.experience} onChange={(e) => setOwnerForm({ ...ownerForm, experience: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" placeholder="12+ Years" />
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1 block">Mission</label>
            <input value={ownerForm.mission} onChange={(e) => setOwnerForm({ ...ownerForm, mission: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-white/60 text-sm mb-1 block">Vision</label>
            <input value={ownerForm.vision} onChange={(e) => setOwnerForm({ ...ownerForm, vision: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1 block">Achievements (one per line)</label>
            <textarea rows={3} value={ownerForm.achievements} onChange={(e) => setOwnerForm({ ...ownerForm, achievements: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none" />
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1 block">Certificates (one per line)</label>
            <textarea rows={3} value={ownerForm.certificates} onChange={(e) => setOwnerForm({ ...ownerForm, certificates: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-white/60 text-sm mb-1 block">Awards (one per line)</label>
            <textarea rows={2} value={ownerForm.awards} onChange={(e) => setOwnerForm({ ...ownerForm, awards: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none" />
          </div>
        </div>
        <button type="submit" disabled={upsertOwner.isPending} className="btn-luxury rounded-full px-6 py-2.5 text-sm mt-4 flex items-center gap-2 disabled:opacity-50">
          <Save className="w-4 h-4" /> {upsertOwner.isPending ? "Saving..." : "Save Profile"}
        </button>
      </motion.form>

      {/* Timeline */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Journey Timeline</h3>
          <button onClick={() => { setEditingTimeline(null); setTimelineForm({ year: "", title: "", description: "", icon: "star", sortOrder: 0 }); setShowTimelineForm(!showTimelineForm); }} className="btn-luxury rounded-full px-4 py-2 text-xs flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add Entry
          </button>
        </div>

        {showTimelineForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} onSubmit={handleTimelineSubmit} className="mb-6 p-4 rounded-lg bg-white/5">
            <div className="grid sm:grid-cols-4 gap-3">
              <input required value={timelineForm.year} onChange={(e) => setTimelineForm({ ...timelineForm, year: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" placeholder="Year" />
              <input required value={timelineForm.title} onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" placeholder="Title" />
              <input value={timelineForm.description} onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" placeholder="Description" />
              <div className="flex gap-2">
                <button type="submit" className="btn-luxury rounded-lg px-4 py-2 text-xs">{editingTimeline ? "Update" : "Add"}</button>
                <button type="button" onClick={() => setShowTimelineForm(false)} className="px-4 py-2 rounded-lg border border-white/20 text-white/60 text-xs">Cancel</button>
              </div>
            </div>
          </motion.form>
        )}

        <div className="space-y-2">
          {timeline?.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-4">
                <span className="text-[#b76e79] font-bold text-sm">{item.year}</span>
                <div>
                  <span className="text-white text-sm font-medium">{item.title}</span>
                  {item.description && <span className="text-white/40 text-xs ml-2">{item.description}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { setEditingTimeline(item.id); setTimelineForm({ year: item.year, title: item.title, description: item.description ?? "", icon: item.icon ?? "star", sortOrder: item.sortOrder ?? 0 }); setShowTimelineForm(true); }} className="w-7 h-7 rounded bg-white/5 flex items-center justify-center hover:bg-white/10 text-white/60">
                  <Pencil className="w-3 h-3" />
                </button>
                <button onClick={() => { if (confirm("Delete?")) deleteTimeline.mutate({ id: item.id }); }} className="w-7 h-7 rounded bg-white/5 flex items-center justify-center hover:bg-red-500/20 text-white/60 hover:text-red-400">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
