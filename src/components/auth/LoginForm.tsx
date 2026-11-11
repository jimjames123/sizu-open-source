
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import useLogout from "@/hooks/useLogout";
import { getNextPath, getNextUrl } from "@/lib/authRedirect";

const LoginForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { cleanupAuthState } = useLogout();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "", // This can be either email or username
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    
    // Clear error when user types
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if the identifier is an email
      const isEmail = formData.identifier.includes('@');
      
      // Clean up existing auth state to prevent conflicts
      cleanupAuthState();
      
      // Attempt to sign out any existing sessions first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log("Pre-signout failed, continuing with login");
      }
      
      let signInResult;
      
      if (isEmail) {
        // Login with email and password
        signInResult = await supabase.auth.signInWithPassword({
          email: formData.identifier,
          password: formData.password,
        });
      } else {
        throw new Error("Please use an email address to login");
      }
      
      if (signInResult.error) throw new Error(signInResult.error.message);
      
      // Success
      toast({
        title: "Login Successful",
        description: "Welcome back to the platform",
      });
      
      // Redirect to the project dashboard with a full page reload for a clean state
      window.location.href = getNextPath();
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Failed to login");
      
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.identifier) {
      setError("Please enter your email address");
      return;
    }
    
    // Only proceed if the identifier is an email
    if (!formData.identifier.includes('@')) {
      setError("Please enter a valid email address to reset your password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        formData.identifier.trim().toLowerCase(),
        { redirectTo: `${window.location.origin}/reset-password` },
      );
      
      if (resetError) throw new Error(resetError.message);
      
      toast({
        title: "Password Reset Email Sent",
        description:
          "Check your inbox (and spam folder) and open the link in this same browser to set a new password.",
      });
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast({
        title: "Failed to Send Reset Email",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getNextUrl(),
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });
      if (oauthError) throw new Error(oauthError.message);
    } catch (error: any) {
      console.error("Google login error:", error);
      setError(error.message || "Failed to sign in with Google");
      toast({
        title: "Google Sign-in Failed",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Email or Username */}
      <div>
        <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input
          type="text"
          id="identifier"
          name="identifier"
          required
          value={formData.identifier}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Enter your email"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <Input
            type={passwordVisible ? "text" : "password"}
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className="form-input pr-10"
            placeholder="Enter password"
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 focus:outline-none"
          >
            {passwordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Remember Me and Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleInputChange}
            className="h-4 w-4 text-sizu-yellow focus:ring-sizu-yellow border-gray-300 rounded"
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        <div className="text-sm">
          <button 
            type="button"
            onClick={handleForgotPassword}
            className="text-sizu-red hover:underline"
          >
            Forgot your password?
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <span className="animate-spin mr-2">⭗</span>
            Logging in...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-5 w-5" />
            Login
          </>
        )}
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      {/* Google Sign In */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 border border-border rounded-md px-4 py-2 font-medium text-foreground bg-background hover:bg-muted transition-colors disabled:opacity-60"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.86c2.26-2.09 3.58-5.17 3.58-8.85z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24z" />
          <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09z" />
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
        </svg>
        Sign in with Google
      </button>

      <div className="text-center text-sm text-gray-600 mt-6">
        <p>Don't have an account?</p>
        <Link to="/register" className="text-sizu-red hover:underline font-medium block mt-1">
          Register your organization to start uploading
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
