
import React from 'react';
import { RegisterFormErrors } from '@/hooks/useRegisterForm';

interface BasicInfoSectionProps {
  email: string;
  fullName: string;
  orgName: string;
  errors: RegisterFormErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  email,
  fullName,
  orgName,
  errors,
  onChange
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold border-b pb-2">Account & Organization Information</h2>
      
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={email}
          onChange={onChange}
          className={`form-input ${errors.email ? 'border-red-500' : ''}`}
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          required
          value={fullName}
          onChange={onChange}
          className={`form-input ${errors.fullName ? 'border-red-500' : ''}`}
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
        )}
      </div>

      {/* Organization Name */}
      <div>
        <label htmlFor="orgName" className="block text-sm font-medium text-gray-700 mb-1">
          Organization Name *
        </label>
        <input
          type="text"
          id="orgName"
          name="orgName"
          required
          value={orgName}
          onChange={onChange}
          className={`form-input uppercase ${errors.orgName ? 'border-red-500' : ''}`}
          placeholder="ENTER ORGANIZATION NAME"
        />
        {errors.orgName ? (
          <p className="text-red-500 text-xs mt-1">{errors.orgName}</p>
        ) : (
          <p className="text-gray-500 text-xs mt-1">Will be displayed in ALL CAPS</p>
        )}
      </div>
    </div>
  );
};

export default BasicInfoSection;
