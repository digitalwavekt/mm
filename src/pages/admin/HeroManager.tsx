import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Image, Video } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { toast } from "sonner";

export default function HeroManager() {
  const utils = trpc.useUtils();
  const { data: slides, isLoading } = trpc.hero.adminList.useQuery();
  const createSlide = trpc.hero.create.useMutation({
    onSuccess: () => { utils.hero.adminList.invalidate(); utils.hero.list.invalidate(); toast.success("Slide created"); setFormOpen(false); },
  });
  const updateSlide = trpc.hero.update.useMutation({
    onSuccess: () => { utils.hero.adminList.invalidate(); utils.hero.list.invalidate(); toast.success("Slide updated"); setEditing(null); },
  });
  const deleteSlide = trpc.hero.delete.useMutation({
    onSuccess: () => { utils.hero.adminList.invalidate(); utils.hero.list.invalidate(); toast.success("Slide deleted"); },
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({
    type: "image" as "image" | "video",
    mediaUrl: "",
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "#contact",
    overlayOpacity: 60,
    sortOrder: 0,
    isActive: true,
  });

  const openEdit = (slide: NonNullable<typeof slides>[0]) => {
    setEditing(slide.id);
    setForm({
      type: (slide.type as "image" | "video") ?? "image",
      mediaUrl: slide.mediaUrl ?? "",
      title: slide.title ?? "",
      subtitle: slide.subtitle ?? "",
      buttonText: slide.buttonText ?? "",
      buttonLink: slide.buttonLink ?? "#contact",
      overlayOpacity: slide.overlayOpacity ?? 60,
      sortOrder: slide.sortOrder ?? 0,
      isActive: slide.isActive ?? true,
    });
    setFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateSlide.mutate({ id: editing, ...form });
    } else {
      createSlide.mutate(form);
    }
  };

  const resetForm = () => {
    setFormOpen(false);
    setEditing(null);
    setForm({
      type: "image", mediaUrl: "", title: "", subtitle: "",
      buttonText: "", buttonLink: "#contact", overlayOpacity: 60, sortOrder: 0, isActive: true,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Playfair_Display']">Hero Slides</h1>
          <p className="text-white/50 mt-1">Manage your homepage slider</p>
        </div>
        <button onClick={() => { resetForm(); setFormOpen(true); }} className="btn-luxury rounded-full px-6 py-3 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Slide
        </button>
      </div>

      {formOpen && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="glass-card rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">{editing ? "Edit Slide" : "New Slide"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-white/60 text-sm mb-1 block">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "image" | "video" })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                <option value="image" className="bg-[#111]">Image</option>
                <option value="video" className="bg-[#111]">Video</option>
              </select>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Media URL *</label>
              {form.type === "image" ? (
                <ImageUploader value={form.mediaUrl} onChange={(url) => setForm({ ...form, mediaUrl: url })} folder="hero" placeholder="/hero/hero-1.jpg" />
              ) : (
                <input required value={form.mediaUrl} onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" placeholder="/hero/hero-1.mp4" />
              )}
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" placeholder="Slide title" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Subtitle</label>
              <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" placeholder="Slide subtitle" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Button Text</label>
              <input value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" placeholder="Book Now" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Button Link</label>
              <input value={form.buttonLink} onChange={(e) => setForm({ ...form, buttonLink: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" placeholder="#contact" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Overlay Opacity ({form.overlayOpacity}%)</label>
              <input type="range" min="0" max="100" value={form.overlayOpacity} onChange={(e) => setForm({ ...form, overlayOpacity: Number(e.target.value) })} className="w-full" />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-white/60 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded" />
                Active
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={createSlide.isPending || updateSlide.isPending} className="btn-luxury rounded-full px-6 py-2 text-sm disabled:opacity-50">
              {editing ? "Update" : "Create"}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2 rounded-full border border-white/20 text-white/60 hover:text-white text-sm transition-colors">Cancel</button>
          </div>
        </motion.form>
      )}

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="glass-card rounded-xl p-5 shimmer h-24" />)
        ) : slides?.length ? (
          slides.map((slide) => (
            <motion.div key={slide.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-xl p-5 flex items-center gap-4">
              <div className="w-20 h-14 rounded-lg overflow-hidden bg-white/5 shrink-0">
                {slide.mediaUrl ? (
                  <img src={slide.mediaUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    {slide.type === "video" ? <Video className="w-5 h-5" /> : <Image className="w-5 h-5" />}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{slide.title ?? "Untitled"}</h4>
                <p className="text-white/40 text-xs truncate">{slide.subtitle}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${slide.isActive ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/40"}`}>
                {slide.isActive ? "Active" : "Inactive"}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(slide)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white/60 hover:text-white">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => { if (confirm("Delete this slide?")) deleteSlide.mutate({ id: slide.id }); }} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-red-500/20 transition-colors text-white/60 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-white/40 text-center py-12">No slides yet. Create your first hero slide!</p>
        )}
      </div>
    </div>
  );
}
