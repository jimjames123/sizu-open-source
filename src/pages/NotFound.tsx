
import { useLocation, Link, Navigate } from "react-router-dom";
import SEO from "@/components/seo/SEO";
import { useEffect } from "react";
import { ArrowLeft, Home, Search, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Common literal paths that should resolve to the homepage
  if (/^\/(index\.html?|home)\/?$/i.test(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <SEO title="Page not found | SIZU" description="The page you're looking for doesn't exist on SIZU." path="/404" />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <AlertTriangle className="mx-auto h-16 w-16 text-amber-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Page not found</h1>
            <p className="text-gray-600">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <p className="text-sm text-gray-500">
              You tried to access: <span className="font-mono text-xs bg-gray-100 p-1 rounded">{location.pathname}</span>
            </p>
            
            <div className="flex flex-col space-y-3">
              <Button asChild variant="default" className="w-full">
                <Link to="/" className="inline-flex items-center justify-center">
                  <Home className="mr-2 h-4 w-4" /> Back to Home
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link to="/projects" className="inline-flex items-center justify-center">
                  <Search className="mr-2 h-4 w-4" /> Explore Projects
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full" onClick={() => window.history.back()}>
                <div className="inline-flex items-center justify-center">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
