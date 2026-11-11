
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecoverySession, setIsRecoverySession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Supabase fires PASSWORD_RECOVERY once it has processed the link.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("ResetPassword auth event:", event);
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setIsRecoverySession(true);
        setIsCheckingSession(false);
      }
    });

    const finishInvalid = (description: string) => {
      if (cancelled) return;
      setIsCheckingSession(false);
      toast({
        title: "Reset Link Problem",
        description,
        variant: "destructive",
      });
      navigate("/login");
    };

    const processLink = async () => {
      const hash = window.location.hash || "";
      const hashParams = new URLSearchParams(hash.replace(/^#/, ""));
      const queryParams = new URLSearchParams(window.location.search);

      // Supabase can report an expired/used link on either the hash or the query string.
      const linkError =
        queryParams.get("error_description") ||
        queryParams.get("error") ||
        hashParams.get("error_description") ||
        hashParams.get("error");
      if (linkError) {
        finishInvalid(
          linkError.replace(/\+/g, " ") +
            ". Please request a new password reset email.",
        );
        return;
      }

      // 1. PKCE flow: the email link lands here with ?code=...
      const code = queryParams.get("code");
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (!exchangeError) {
          window.history.replaceState({}, document.title, "/reset-password");
          setIsRecoverySession(true);
          setIsCheckingSession(false);
          return;
        }
        console.error("Code exchange failed:", exchangeError);
      }

      // 2. Token-hash flow: ?token_hash=...&type=recovery
      const tokenHash = queryParams.get("token_hash") || hashParams.get("token_hash");
      const linkType = queryParams.get("type") || hashParams.get("type");
      if (tokenHash) {
        const { error: otpError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: (linkType as "recovery") || "recovery",
        });
        if (cancelled) return;
        if (!otpError) {
          window.history.replaceState({}, document.title, "/reset-password");
          setIsRecoverySession(true);
          setIsCheckingSession(false);
          return;
        }
        console.error("Token verification failed:", otpError);
      }

      // 3. Implicit flow: tokens arrive in the URL hash and are set by the client.
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      if (accessToken && refreshToken) {
        const { error: setError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (cancelled) return;
        if (!setError) {
          window.history.replaceState({}, document.title, "/reset-password");
          setIsRecoverySession(true);
          setIsCheckingSession(false);
          return;
        }
        console.error("Setting recovery session failed:", setError);
      }

      // 4. Fall back to polling for a session Supabase may still be establishing.
      for (let attempt = 0; attempt < 10; attempt++) {
        const { data: { session } } = await supabase.auth.getSession();
        if (cancelled) return;
        if (session) {
          setIsRecoverySession(true);
          setIsCheckingSession(false);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      finishInvalid("This password reset link is invalid or has expired. Please request a new one.");
    };

    processLink();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (updateError) throw updateError;

      toast({
        title: "Password Updated Successfully",
        description: "Your password has been updated. You can now log in with your new password.",
      });

      // Sign out so they can log in fresh with the new password
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error: any) {
      console.error("Password reset error:", error);
      setError(error.message || "Failed to update password");

      toast({
        title: "Password Update Failed",
        description: error.message || "Please try again or request a new reset link",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <>
        <Navbar />
        <main className="page-container flex items-center justify-center min-h-[calc(100vh-240px)]">
          <div className="text-center">
            <span className="animate-spin text-2xl">⭗</span>
            <p className="mt-2 text-muted-foreground">Verifying reset link...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page-container flex items-center justify-center min-h-[calc(100vh-240px)]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Reset Your Password</h1>
            <p className="text-muted-foreground mt-2">Enter your new password below</p>
          </div>

          <div className="glass-panel rounded-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                  New Password
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
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground focus:outline-none"
                  >
                    {passwordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input
                    type={confirmPasswordVisible ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="form-input pr-10"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground focus:outline-none"
                  >
                    {confirmPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⭗</span>
                    Updating Password...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ResetPassword;
