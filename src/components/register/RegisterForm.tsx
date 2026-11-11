
import React from 'react';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import BasicInfoSection from './BasicInfoSection';
import OrganizationBriefSection from './OrganizationBriefSection';
import LogoUploadSection from './LogoUploadSection';
import OrganizationTypeSelect from './OrganizationTypeSelect';
import ContactInfoSection from './ContactInfoSection';
import PasswordSection from './PasswordSection';
import TermsSection from './TermsSection';

const organizationTypes = [
  "Government/Public",
  "Corporate/Private",
  "Social Enterprise",
  "Foreign Organization",
  "NGO/Non-Profit",
  "Community Based"
];

const RegisterForm: React.FC = () => {
  const {
    formData,
    errors,
    isLoading,
    logoPreview,
    passwordVisible,
    confirmPasswordVisible,
    handleInputChange,
    handleLogoUpload,
    handleSubmit,
    setPasswordVisible,
    setConfirmPasswordVisible,
    countryCode,
    handleCountryCodeChange
  } = useRegisterForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BasicInfoSection
        email={formData.email}
        fullName={formData.fullName}
        orgName={formData.orgName}
        errors={errors}
        onChange={handleInputChange}
      />

      <OrganizationBriefSection
        value={formData.orgBrief}
        onChange={handleInputChange}
        error={errors.orgBrief}
      />

      <LogoUploadSection
        onUpload={handleLogoUpload}
        logoPreview={logoPreview}
      />

      <OrganizationTypeSelect
        value={formData.orgType}
        onChange={handleInputChange}
        error={errors.orgType}
        organizationTypes={organizationTypes}
      />

      <ContactInfoSection
        phone={formData.phone}
        address={formData.address}
        website={formData.website}
        errors={errors}
        onChange={handleInputChange}
        countryCode={countryCode}
        onCountryCodeChange={handleCountryCodeChange}
      />

      <PasswordSection
        password={formData.password}
        confirmPassword={formData.confirmPassword}
        passwordVisible={passwordVisible}
        confirmPasswordVisible={confirmPasswordVisible}
        errors={errors}
        onChange={handleInputChange}
        setPasswordVisible={setPasswordVisible}
        setConfirmPasswordVisible={setConfirmPasswordVisible}
      />

      <TermsSection
        acceptTerms={formData.acceptTerms}
        error={errors.acceptTerms}
        onChange={handleInputChange}
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <span className="animate-spin mr-2">⭗</span>
            Creating Account...
          </>
        ) : (
          "Create Account & Register Organization"
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
