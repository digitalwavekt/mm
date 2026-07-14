import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { toast } from "sonner";

const categories = ["Bridal", "Party", "Fashion", "Natural", "Creative"];
const emptyForm = { title: "", imageUrl: "", category: "Bridal", description: "", clientName: "", sortOrder: 0, isActive: true };

export default function GalleryManager() {
  const utils = trpc.useUtils();
  const { data: items, isLoading } = trpc.gallery.adminList.useQuery();
  const createItem = trpc.gallery.create.useMutation({
    onSuccess: () => { utils.gallery.adminList.invalidate(); utils.gallery.list.invalidate(); toast.success("Added to gallery"); setFormOpen(false); },
  });
  const updateItem = trpc.gallery.update.useMutation({
    onSuccess: () => { utils.gallery.adminList.invalidate(); utils.gallery.list.invalidate(); toast.success("Updated"); setEditing(null); setFormOpen(false); },
  });
  const deleteItem = trpc.gallery.delete.useMutation({
    onSuccess: () => { utils.gallery.adminList.invalidate(); utils.gallery.list.invalidate(); toast.success("Deleted"); },
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openEdit = (item: NonNullable<typeof items>[0]) => {
    setEditing(item.id);
    setForm({ title: item.title ?? "", imageUrl: item.imageUrl, category: item.category, description: item.description ?? "", clientName: item.clientName ?? "", sortOrder: item.sortOrder ?? 0, isActive: item.isActive ?? true });
    setFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) updateItem.mutate({ id: editing, ...form });
    else createItem.mutate(form);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-white font-['Playfair_Display']">Gallery</h1><p className="text-white/50 mt-1">Manage portfolio images</p></div>
        <button onClick={() => { setEditing(null); setForm(emptyForm); setFormOpen(true); }} className="btn-luxury rounded-full px-6 py-3 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Image</button>
      </div>

      {formOpen && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="glass-card rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">{editing ? "Edit" : "New"} Gallery Item</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-white/60 text-sm mb-1 block">Image *</label>
              <ImageUploader value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} folder="gallery" placeholder="/gallery/bridal-1.jpg" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                {categories.map((c) => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Client Name</label>
              <input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 text-white/60 text-sm cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded" /> Active</label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={createItem.isPending || updateItem.isPending} className="btn-luxury rounded-full px-6 py-2 text-sm disabled:opacity-50">{editing ? "Update" : "Add"}</button>
            <button type="button" onClick={() => setFormOpen(false)} className="px-6 py-2 rounded-full border border-white/20 text-white/60 hover:text-white text-sm">Cancel</button>
          </div>
        </motion.form>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="glass-card rounded-xl shimmer aspect-square" />) :
          items?.length ? items.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-xl overflow-hidden group">
              <div className="aspect-square relative">
                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white hover:bg-white/30"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => { if (confirm("Delete?")) deleteItem.mutate({ id: item.id }); }} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white hover:bg-red-500/50"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-white text-sm truncate">{item.title ?? "Untitled"}</p>
                <span className="text-[#b76e79] text-xs">{item.category}</span>
              </div>
            </motion.div>
          )) : <p className="text-white/40 text-center py-12 col-span-full">No gallery items</p>}
      </div>
    </div>
  );
}
