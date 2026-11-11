
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderOpen, PlusCircle, User, Settings, Home, LogOut } from "lucide-react";
import useLogout from "@/hooks/useLogout";

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout } = useLogout();
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/dashboard",
    },
    {
      title: "My Projects",
      icon: <FolderOpen className="h-5 w-5" />,
      path: "/dashboard/projects",
    },
    {
      title: "Add Project",
      icon: <PlusCircle className="h-5 w-5" />,
      path: "/dashboard/projects/add",
    },
    {
      title: "My Account",
      icon: <User className="h-5 w-5" />,
      path: "/dashboard/account",
    },
    {
      title: "Edit Profile",
      icon: <Settings className="h-5 w-5" />,
      path: "/dashboard/profile",
    },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-full md:w-64 bg-white rounded-lg shadow-sm border p-4 sticky top-4">
      <h2 className="font-bold text-lg text-gray-800 mb-4 px-2">Organization Dashboard</h2>
      
      <nav>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-sizu-red text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.title}
              </button>
            </li>
          ))}
          
          {/* Logout Option */}
          <li className="mt-8 border-t pt-4">
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

export default DashboardSidebar;
