import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Image,
  User,
  Sparkles,
  Camera,
  Star,
  Gift,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/Logo";

const menuItems = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", path: "/admin" },
  { icon: <Image className="w-5 h-5" />, label: "Hero Slides", path: "/admin/hero" },
  { icon: <User className="w-5 h-5" />, label: "About", path: "/admin/about" },
  { icon: <Sparkles className="w-5 h-5" />, label: "Services", path: "/admin/services" },
  { icon: <Camera className="w-5 h-5" />, label: "Gallery", path: "/admin/gallery" },
  { icon: <Star className="w-5 h-5" />, label: "Reviews", path: "/admin/reviews" },
  { icon: <Gift className="w-5 h-5" />, label: "Offers", path: "/admin/offers" },
  { icon: <Mail className="w-5 h-5" />, label: "Contact Leads", path: "/admin/leads" },
  { icon: <Users className="w-5 h-5" />, label: "Newsletter", path: "/admin/newsletter" },
  { icon: <Settings className="w-5 h-5" />, label: "Settings", path: "/admin/settings" },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, isAuthenticated, logout } = useAuth({
    redirectOnUnauthenticated: true,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#d4af37] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed h-full transition-all duration-300 z-30 ${
          collapsed ? "w-20" : "w-64"
        }`}
        style={{
          background: "linear-gradient(180deg, #0f0f0f 0%, #0a0a0a 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-white/5">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <Logo size="sm" />
              <span className="font-semibold luxury-gradient-text text-sm">Admin</span>
            </motion.div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "luxury-gradient text-white shadow-lg shadow-[#b76e79]/20"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
                title={collapsed ? item.label : undefined}
              >
                {item.icon}
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full luxury-gradient flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">
                {user?.name?.charAt(0) ?? "A"}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name ?? "Admin"}</p>
                <p className="text-xs text-white/40 truncate">{user?.email ?? ""}</p>
              </div>
            )}
            <button
              onClick={logout}
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed left-0 top-0 bottom-0 w-[280px] z-40 lg:hidden flex flex-col"
            style={{
              background: "linear-gradient(180deg, #0f0f0f 0%, #0a0a0a 100%)",
            }}
          >
            <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Logo size="sm" />
                <span className="font-semibold luxury-gradient-text">Admin Panel</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 py-4 px-3 space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMobileOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                      isActive
                        ? "luxury-gradient text-white"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 min-h-screen transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-64"}`}>
        {/* Mobile Header */}
        <div className="lg:hidden h-16 flex items-center justify-between px-4 border-b border-white/5 sticky top-0 z-20 glass-effect">
          <button onClick={() => setMobileOpen(true)} className="p-2">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold luxury-gradient-text">Admin Panel</span>
          <div className="w-8 h-8 rounded-full luxury-gradient flex items-center justify-center">
            <span className="text-white font-bold text-xs">{user?.name?.charAt(0) ?? "A"}</span>
          </div>
        </div>

        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
