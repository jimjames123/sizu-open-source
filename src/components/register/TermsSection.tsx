
import React from 'react';
import { Link } from 'react-router-dom';

interface TermsSectionProps {
  acceptTerms: boolean;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TermsSection: React.FC<TermsSectionProps> = ({
  acceptTerms,
  error,
  onChange
}) => {
  return (
    <div>
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="acceptTerms"
          name="acceptTerms"
          required
          checked={acceptTerms}
          onChange={onChange}
          className={`mt-1 ${error ? 'border-red-500' : ''}`}
        />
        <label htmlFor="acceptTerms" className="text-gray-700 text-sm">
          I accept the <Link to="/terms" className="text-sizu-red hover:underline">Terms and Conditions</Link> of SIZU and understand that this registration creates both my user account and organization profile
        </label>
      </div>
      {error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}
    </div>
  );
};

export default TermsSection;
