import { Routes, Route } from "react-router";
import { Toaster } from "sonner";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import HeroManager from "./pages/admin/HeroManager";
import AboutManager from "./pages/admin/AboutManager";
import ServicesManager from "./pages/admin/ServicesManager";
import GalleryManager from "./pages/admin/GalleryManager";
import ReviewsManager from "./pages/admin/ReviewsManager";
import OffersManager from "./pages/admin/OffersManager";
import LeadsManager from "./pages/admin/LeadsManager";
import NewsletterManager from "./pages/admin/NewsletterManager";
import SettingsManager from "./pages/admin/SettingsManager";

function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/hero" element={<HeroManager />} />
        <Route path="/about" element={<AboutManager />} />
        <Route path="/services" element={<ServicesManager />} />
        <Route path="/gallery" element={<GalleryManager />} />
        <Route path="/reviews" element={<ReviewsManager />} />
        <Route path="/offers" element={<OffersManager />} />
        <Route path="/leads" element={<LeadsManager />} />
        <Route path="/newsletter" element={<NewsletterManager />} />
        <Route path="/settings" element={<SettingsManager />} />
      </Routes>
    </AdminLayout>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      />
    </>
  );
}
