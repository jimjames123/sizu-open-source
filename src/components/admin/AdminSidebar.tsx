
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Shield, 
  Users, 
  FileText, 
  Calendar, 
  Home,
  LogOut,
  Settings,
  CreditCard,
  CheckCircle,
  Info,
  BarChart3,
  HandCoins,
  Sparkles
} from "lucide-react";
import useLogout from "@/hooks/useLogout";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout } = useLogout();
  
  const menuItems = [
    {
      title: "Admin Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/admin",
    },
    {
      title: "Organizations",
      icon: <Users className="h-5 w-5" />,
      path: "/admin/organizations",
    },
    {
      title: "Approved Organizations",
      icon: <CheckCircle className="h-5 w-5" />,
      path: "/admin/approved-organizations",
    },
    {
      title: "Projects",
      icon: <FileText className="h-5 w-5" />,
      path: "/admin/projects",
    },
    {
      title: "Market Place",
      icon: <Calendar className="h-5 w-5" />,
      path: "/admin/events",
    },
    {
      title: "Payment Requests",
      icon: <CreditCard className="h-5 w-5" />,
      path: "/admin/payments",
    },
    {
      title: "Vital Info",
      icon: <Info className="h-5 w-5" />,
      path: "/admin/vital-info",
    },
    {
      title: "Opportunity Tracker",
      icon: <HandCoins className="h-5 w-5" />,
      path: "/admin/opportunities",
    },
    {
      title: "Traffic Reports",
      icon: <BarChart3 className="h-5 w-5" />,
      path: "/admin/traffic",
    },
    {
      title: "AI Insights",
      icon: <Sparkles className="h-5 w-5" />,
      path: "/admin/ai-insights",
    },
    {
      title: "Admin Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/admin/settings",
    },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-full md:w-64 bg-white rounded-lg shadow-sm border p-4 sticky top-4">
      <div className="flex items-center gap-2 mb-4 px-2">
        <Shield className="h-5 w-5 text-blue-600" />
        <h2 className="font-bold text-lg text-gray-800">Admin Panel</h2>
      </div>
      
      <nav>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.title}
              </button>
            </li>
          ))}
          
          {/* Back to Normal Dashboard */}
          <li className="mt-4 border-t pt-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Home className="h-5 w-5" />
              User Dashboard
            </button>
          </li>
          
          {/* Logout Option */}
          <li className="border-t pt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
