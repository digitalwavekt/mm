import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Globe, Phone, Mail, MapPin, Clock, Instagram, Facebook, Youtube } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";

const settingFields = [
  { key: "siteName", label: "Site Name", icon: <Globe className="w-4 h-4" />, placeholder: "Mamta Makeover" },
  { key: "tagline", label: "Tagline", icon: <Globe className="w-4 h-4" />, placeholder: "Where Beauty Meets Artistry" },
  { key: "phone", label: "Phone", icon: <Phone className="w-4 h-4" />, placeholder: "+1 (555) 234-5678" },
  { key: "whatsapp", label: "WhatsApp", icon: <Phone className="w-4 h-4" />, placeholder: "+15552345678" },
  { key: "email", label: "Email", icon: <Mail className="w-4 h-4" />, placeholder: "hello@mamtamakeover.com" },
  { key: "address", label: "Address", icon: <MapPin className="w-4 h-4" />, placeholder: "123 Luxury Lane, Beverly Hills, CA 90210" },
  { key: "workingHours", label: "Working Hours", icon: <Clock className="w-4 h-4" />, placeholder: "Mon-Sat: 9AM - 8PM" },
  { key: "instagram", label: "Instagram URL", icon: <Instagram className="w-4 h-4" />, placeholder: "https://instagram.com/..." },
  { key: "facebook", label: "Facebook URL", icon: <Facebook className="w-4 h-4" />, placeholder: "https://facebook.com/..." },
  { key: "youtube", label: "YouTube URL", icon: <Youtube className="w-4 h-4" />, placeholder: "https://youtube.com/..." },
  { key: "googleMap", label: "Google Map URL", icon: <MapPin className="w-4 h-4" />, placeholder: "https://maps.google.com/..." },
  { key: "logo", label: "Logo URL", icon: <Globe className="w-4 h-4" />, placeholder: "/logo.png" },
  { key: "favicon", label: "Favicon URL", icon: <Globe className="w-4 h-4" />, placeholder: "/favicon.ico" },
  { key: "copyright", label: "Copyright", icon: <Globe className="w-4 h-4" />, placeholder: "2026 Mamta Makeover" },
  { key: "developerCredit", label: "Developer Credit", icon: <Globe className="w-4 h-4" />, placeholder: "Developed by KT" },
  { key: "developerContact", label: "Developer Contact URL", icon: <Globe className="w-4 h-4" />, placeholder: "https://kt.digitalwaveitsolution.online" },
];

export default function SettingsManager() {
  const utils = trpc.useUtils();
  const { data: settings, isLoading } = trpc.settings.adminList.useQuery();
  const upsertMany = trpc.settings.upsertMany.useMutation({
    onSuccess: () => {
      utils.settings.adminList.invalidate();
      utils.settings.list.invalidate();
      toast.success("Settings saved");
    },
  });

  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      settings.forEach((s) => { if (s.value) map[s.key] = s.value; });
      setForm(map);
    }
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const data = settingFields.map((f) => ({ key: f.key, value: form[f.key] ?? "" })).filter((d) => d.value);
    upsertMany.mutate(data);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2 font-['Playfair_Display']">Settings</h1>
      <p className="text-white/50 mb-8">Manage website configuration</p>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="glass-card rounded-xl p-5 shimmer h-16" />)}
        </div>
      ) : (
        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSave} className="glass-card rounded-xl p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {settingFields.map((field) => (
              <div key={field.key}>
                <label className="text-white/60 text-sm mb-1 flex items-center gap-2">
                  <span className="text-[#b76e79]">{field.icon}</span>
                  {field.label}
                </label>
                <input
                  value={form[field.key] ?? ""}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
          <button type="submit" disabled={upsertMany.isPending} className="btn-luxury rounded-full px-8 py-3 mt-6 flex items-center gap-2 disabled:opacity-50">
            <Save className="w-4 h-4" />
            {upsertMany.isPending ? "Saving..." : "Save All Settings"}
          </button>
        </motion.form>
      )}
    </div>
  );
}
