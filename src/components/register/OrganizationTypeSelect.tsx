
import React from 'react';

interface OrganizationTypeSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  organizationTypes: string[];
}

const OrganizationTypeSelect: React.FC<OrganizationTypeSelectProps> = ({
  value,
  onChange,
  error,
  organizationTypes
}) => {
  return (
    <div>
      <label htmlFor="orgType" className="block text-sm font-medium text-gray-700 mb-1">
        Organization Type *
      </label>
      <select
        id="orgType"
        name="orgType"
        required
        value={value}
        onChange={onChange}
        className={`form-input ${error ? 'border-red-500' : ''}`}
      >
        <option value="">Select organization type</option>
        {organizationTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default OrganizationTypeSelect;
