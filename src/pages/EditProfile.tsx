
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProfileForm from "@/components/profile/ProfileForm";
import { useProfileForm } from "@/hooks/useProfileForm";

const EditProfile = () => {
  const navigate = useNavigate();
  const { 
    isLoading, 
    isSaving, 
    logoPreview, 
    formDefaults,
    fetchProfileData,
    handleLogoUpload, 
    handleSubmit 
  } = useProfileForm();
  
  useEffect(() => {
    fetchProfileData();
  }, []);
  
  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <Navbar />
      <main className="page-container pt-12 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Edit Organization Profile</h1>
          <p className="text-gray-600 mb-8">
            Update your organization's information and presence on SIZU
          </p>
          
          <div className="glass-panel rounded-xl p-8 shadow-md">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sizu-red"></div>
              </div>
            ) : (
              <ProfileForm
                defaultValues={formDefaults}
                logoPreview={logoPreview}
                onLogoUpload={handleLogoUpload}
                onSubmit={handleSubmit}
                isSaving={isSaving}
                onCancel={handleCancel}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default EditProfile;
