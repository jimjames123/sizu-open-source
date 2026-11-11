
import React from 'react';

interface OrganizationBriefSectionProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
}

const OrganizationBriefSection: React.FC<OrganizationBriefSectionProps> = ({
  value,
  onChange,
  error
}) => {
  const minLength = 10;
  const maxLength = 200;
  const isValid = value.length >= minLength && value.length <= maxLength;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Allow typing but don't exceed max length
    if (e.target.value.length <= maxLength) {
      onChange(e);
    }
  };

  return (
    <div>
      <label htmlFor="orgBrief" className="block text-sm font-medium text-gray-700 mb-1">
        Organization Brief * <span className="text-gray-500 text-xs">({minLength}-{maxLength} characters)</span>
      </label>
      <textarea
        id="orgBrief"
        name="orgBrief"
        required
        value={value}
        onChange={handleChange}
        minLength={minLength}
        maxLength={maxLength}
        rows={3}
        className={`form-input resize-none ${error || !isValid ? 'border-red-500' : 'border-gray-300'}`}
        placeholder="Brief description of your organization..."
      />
      <div className="flex justify-between items-center mt-1">
        <p className={`text-xs ${error || !isValid ? 'text-red-500' : 'text-gray-500'}`}>
          {error || (value.length < minLength ? `Minimum ${minLength} characters required` : '')}
        </p>
        <p className={`text-xs ${value.length > maxLength ? 'text-red-500' : value.length > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-500'}`}>
          {value.length}/{maxLength} characters
        </p>
      </div>
    </div>
  );
};

export default OrganizationBriefSection;
