import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { toast } from "sonner";

const emptyForm = {
  name: "", slug: "", shortDescription: "", description: "", imageUrl: "",
  bannerImageUrl: "", price: "", duration: "", category: "",
  benefits: "", preparation: "", afterCare: "", sortOrder: 0, isActive: true, isFeatured: false,
};

export default function ServicesManager() {
  const utils = trpc.useUtils();
  const { data: services, isLoading } = trpc.services.adminList.useQuery();
  const createService = trpc.services.create.useMutation({
    onSuccess: () => { utils.services.adminList.invalidate(); toast.success("Service created"); setFormOpen(false); },
  });
  const updateService = trpc.services.update.useMutation({
    onSuccess: () => { utils.services.adminList.invalidate(); toast.success("Service updated"); setEditing(null); setFormOpen(false); },
  });
  const deleteService = trpc.services.delete.useMutation({
    onSuccess: () => { utils.services.adminList.invalidate(); toast.success("Service deleted"); },
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openEdit = (s: NonNullable<typeof services>[0]) => {
    setEditing(s.id);
    setForm({
      name: s.name, slug: s.slug, shortDescription: s.shortDescription ?? "",
      description: s.description ?? "", imageUrl: s.imageUrl ?? "", bannerImageUrl: s.bannerImageUrl ?? "",
      price: s.price ?? "", duration: s.duration ?? "", category: s.category ?? "",
      benefits: (s.benefits as string[])?.join("\n") ?? "", preparation: s.preparation ?? "",
      afterCare: s.afterCare ?? "", sortOrder: s.sortOrder ?? 0, isActive: s.isActive ?? true, isFeatured: s.isFeatured ?? false,
    });
    setFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, benefits: form.benefits.split("\n").filter(Boolean) };
    if (editing) {
      updateService.mutate({ id: editing, ...data });
    } else {
      createService.mutate(data);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Playfair_Display']">Services</h1>
          <p className="text-white/50 mt-1">Manage your service offerings</p>
        </div>
        <button onClick={() => { setEditing(null); setForm(emptyForm); setFormOpen(true); }} className="btn-luxury rounded-full px-6 py-3 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {formOpen && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="glass-card rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">{editing ? "Edit Service" : "New Service"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-white/60 text-sm mb-1 block">Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Slug *</label>
              <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" placeholder="bridal-makeup" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-white/60 text-sm mb-1 block">Short Description</label>
              <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-white/60 text-sm mb-1 block">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Image</label>
              <ImageUploader value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} folder="services" placeholder="/services/bridal.jpg" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Price</label>
              <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" placeholder="350.00" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Duration</label>
              <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" placeholder="2-3 hours" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Category</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" placeholder="Bridal" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-white/60 text-sm mb-1 block">Benefits (one per line)</label>
              <textarea rows={2} value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none" />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-white/60 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded" /> Active
              </label>
              <label className="flex items-center gap-2 text-white/60 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="rounded" /> Featured
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={createService.isPending || updateService.isPending} className="btn-luxury rounded-full px-6 py-2 text-sm disabled:opacity-50">{editing ? "Update" : "Create"}</button>
            <button type="button" onClick={() => setFormOpen(false)} className="px-6 py-2 rounded-full border border-white/20 text-white/60 hover:text-white text-sm">Cancel</button>
          </div>
        </motion.form>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="glass-card rounded-xl p-5 shimmer h-32" />)
        ) : services?.length ? (
          services.map((service) => (
            <motion.div key={service.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {service.imageUrl && (
                    <img src={service.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  )}
                  <div>
                    <h4 className="text-white font-medium text-sm">{service.name}</h4>
                    <p className="text-white/40 text-xs">{service.category} {service.price && `| $${service.price}`}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(service)} className="w-7 h-7 rounded bg-white/5 flex items-center justify-center hover:bg-white/10 text-white/60"><Pencil className="w-3 h-3" /></button>
                  <button onClick={() => { if (confirm("Delete?")) deleteService.mutate({ id: service.id }); }} className="w-7 h-7 rounded bg-white/5 flex items-center justify-center hover:bg-red-500/20 text-white/60 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {service.isActive && <span className="px-2 py-0.5 rounded-full text-[10px] bg-green-500/20 text-green-400">Active</span>}
                {service.isFeatured && <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#d4af37]/20 text-[#d4af37]">Featured</span>}
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-white/40 text-center py-12 col-span-full">No services yet</p>
        )}
      </div>
    </div>
  );
}
