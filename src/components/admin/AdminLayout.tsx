
import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import AdminSidebar from "./AdminSidebar";
import { MoveLeft } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  backLink?: {
    url: string;
    label: string;
  };
}

const AdminLayout = ({ 
  children, 
  title, 
  description, 
  backLink 
}: AdminLayoutProps) => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className="page-container pt-12 pb-20 bg-gray-50 min-h-[calc(100vh-64px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 mb-6 md:mb-0">
              <AdminSidebar />
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              {backLink && (
                <button 
                  onClick={() => navigate(backLink.url)}
                  className="flex items-center text-sm text-gray-600 hover:text-blue-600 mb-4"
                >
                  <MoveLeft className="w-4 h-4 mr-1" />
                  {backLink.label}
                </button>
              )}
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
              
              {description && (
                <p className="text-gray-600 mb-8">{description}</p>
              )}
              
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminLayout;
