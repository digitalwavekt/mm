import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { toast } from "sonner";

const emptyForm = { title: "", description: "", imageUrl: "", discountPercent: "", couponCode: "", validFrom: "", validUntil: "", ctaText: "Claim Offer", isActive: true };

export default function OffersManager() {
  const utils = trpc.useUtils();
  const { data: offers, isLoading } = trpc.ads.adminOffersList.useQuery();
  const createOffer = trpc.ads.createOffer.useMutation({ onSuccess: () => { utils.ads.adminOffersList.invalidate(); utils.ads.offers.invalidate(); toast.success("Offer created"); setFormOpen(false); } });
  const updateOffer = trpc.ads.updateOffer.useMutation({ onSuccess: () => { utils.ads.adminOffersList.invalidate(); utils.ads.offers.invalidate(); toast.success("Offer updated"); setEditing(null); setFormOpen(false); } });
  const deleteOffer = trpc.ads.deleteOffer.useMutation({ onSuccess: () => { utils.ads.adminOffersList.invalidate(); utils.ads.offers.invalidate(); toast.success("Offer deleted"); } });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openEdit = (o: NonNullable<typeof offers>[0]) => {
    setEditing(o.id);
    setForm({ title: o.title, description: o.description ?? "", imageUrl: o.imageUrl ?? "", discountPercent: o.discountPercent?.toString() ?? "", couponCode: o.couponCode ?? "", validFrom: o.validFrom ? new Date(o.validFrom).toISOString().split("T")[0] : "", validUntil: o.validUntil ? new Date(o.validUntil).toISOString().split("T")[0] : "", ctaText: o.ctaText ?? "Claim Offer", isActive: o.isActive ?? true });
    setFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, discountPercent: form.discountPercent ? Number(form.discountPercent) : undefined, validFrom: form.validFrom ? new Date(form.validFrom) : undefined, validUntil: form.validUntil ? new Date(form.validUntil) : undefined };
    if (editing) updateOffer.mutate({ id: editing, ...data });
    else createOffer.mutate(data);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-white font-['Playfair_Display']">Offers</h1><p className="text-white/50 mt-1">Manage promotions and deals</p></div>
        <button onClick={() => { setEditing(null); setForm(emptyForm); setFormOpen(true); }} className="btn-luxury rounded-full px-6 py-3 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Offer</button>
      </div>

      {formOpen && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="glass-card rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">{editing ? "Edit" : "New"} Offer</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-white/60 text-sm mb-1 block">Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-white/60 text-sm mb-1 block">Description</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Image</label>
              <ImageUploader value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} folder="offers" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Discount %</label>
              <input type="number" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Coupon Code</label>
              <input value={form.couponCode} onChange={(e) => setForm({ ...form, couponCode: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">CTA Text</label>
              <input value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Valid From</label>
              <input type="date" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Valid Until</label>
              <input type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={createOffer.isPending || updateOffer.isPending} className="btn-luxury rounded-full px-6 py-2 text-sm disabled:opacity-50">{editing ? "Update" : "Create"}</button>
            <button type="button" onClick={() => setFormOpen(false)} className="px-6 py-2 rounded-full border border-white/20 text-white/60 hover:text-white text-sm">Cancel</button>
          </div>
        </motion.form>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="glass-card rounded-xl p-5 shimmer h-32" />) :
          offers?.length ? offers.map((offer) => (
            <motion.div key={offer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {offer.imageUrl && <img src={offer.imageUrl} alt="" className="w-14 h-14 rounded-lg object-cover" />}
                  <div>
                    <h4 className="text-white font-medium text-sm">{offer.title}</h4>
                    {offer.discountPercent && <span className="text-[#d4af37] text-xs font-bold">{offer.discountPercent}% OFF</span>}
                    {offer.couponCode && <span className="text-white/40 text-xs ml-2">Code: {offer.couponCode}</span>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(offer)} className="w-7 h-7 rounded bg-white/5 flex items-center justify-center hover:bg-white/10 text-white/60"><Pencil className="w-3 h-3" /></button>
                  <button onClick={() => { if (confirm("Delete?")) deleteOffer.mutate({ id: offer.id }); }} className="w-7 h-7 rounded bg-white/5 flex items-center justify-center hover:bg-red-500/20 text-white/60 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {offer.isActive && <span className="px-2 py-0.5 rounded-full text-[10px] bg-green-500/20 text-green-400">Active</span>}
                {offer.validUntil && new Date(offer.validUntil) < new Date() && <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500/20 text-red-400">Expired</span>}
              </div>
            </motion.div>
          )) : <p className="text-white/40 text-center py-12 col-span-full">No offers yet</p>}
      </div>
    </div>
  );
}
