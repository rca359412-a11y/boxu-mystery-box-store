import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
  Bell
} from "lucide-react";
import backend from "~backend/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import DashboardOverview from "../components/admin/DashboardOverview";
import OrdersManagement from "../components/admin/OrdersManagement";
import ProductsManagement from "../components/admin/ProductsManagement";
import CustomersManagement from "../components/admin/CustomersManagement";
import SettingsManagement from "../components/admin/SettingsManagement";
import IntegrationsManagement from "../components/admin/IntegrationsManagement";
import ClionDashboard from "../components/admin/ClionDashboard";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Package, label: "Commandes", path: "/admin/orders" },
  { icon: Package, label: "Produits", path: "/admin/products" },
  { icon: Users, label: "Clients", path: "/admin/customers" },
  { icon: Settings, label: "Paramètres", path: "/admin/settings" },
  { icon: Zap, label: "Intégrations", path: "/admin/integrations" },
  { icon: Bell, label: "Clion", path: "/admin/clion" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  const validateTokenMutation = useMutation({
    mutationFn: (token: string) => backend.auth.validateAdminToken({ token }),
    onSuccess: (data) => {
      if (data.valid && data.admin) {
        setAdminUser(data.admin);
      } else {
        handleLogout();
      }
    },
    onError: () => {
      handleLogout();
    }
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    validateTokenMutation.mutate(token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setAdminUser(null);
    navigate("/admin/login");
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès.",
    });
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-black text-white transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
          <span className="text-xl font-bold">Boxu Admin</span>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-gray-800"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <nav className="mt-8">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-800 transition-colors ${
                  isActive ? "bg-gray-800 border-r-2 border-white" : ""
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-gray-800">
          <div className="text-sm text-gray-400 mb-2">
            Connecté en tant que: {adminUser.username}
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-gray-800"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Bienvenue, {adminUser.username}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/orders" element={<OrdersManagement />} />
            <Route path="/products" element={<ProductsManagement />} />
            <Route path="/customers" element={<CustomersManagement />} />
            <Route path="/settings" element={<SettingsManagement />} />
            <Route path="/integrations" element={<IntegrationsManagement />} />
            <Route path="/clion" element={<ClionDashboard />} />
          </Routes>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
