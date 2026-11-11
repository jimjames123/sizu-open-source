
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordSectionProps {
  password: string;
  confirmPassword: string;
  passwordVisible: boolean;
  confirmPasswordVisible: boolean;
  errors: {[key: string]: string};
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setPasswordVisible: (visible: boolean) => void;
  setConfirmPasswordVisible: (visible: boolean) => void;
}

const PasswordSection: React.FC<PasswordSectionProps> = ({
  password,
  confirmPassword,
  passwordVisible,
  confirmPasswordVisible,
  errors,
  onChange,
  setPasswordVisible,
  setConfirmPasswordVisible
}) => {
  return (
    <>
      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password *
        </label>
        <div className="relative">
          <input
            type={passwordVisible ? "text" : "password"}
            id="password"
            name="password"
            required
            value={password}
            onChange={onChange}
            className={`form-input pr-10 ${errors.password ? 'border-red-500' : ''}`}
            placeholder="Enter password"
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 focus:outline-none"
          >
            {passwordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password ? (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        ) : (
          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 8 characters long with a mix of letters, numbers, and symbols.
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password *
        </label>
        <div className="relative">
          <input
            type={confirmPasswordVisible ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            required
            value={confirmPassword}
            onChange={onChange}
            className={`form-input pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            placeholder="Confirm password"
          />
          <button
            type="button"
            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 focus:outline-none"
          >
            {confirmPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
        )}
      </div>
    </>
  );
};

export default PasswordSection;
