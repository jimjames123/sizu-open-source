
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import NavbarLogo from "./navbar/NavbarLogo";
import DesktopNavLinks from "./navbar/DesktopNavLinks";
import MobileNavLinks from "./navbar/MobileNavLinks";
import AuthButtons from "./navbar/AuthButtons";
import MobileMenuToggle from "./navbar/MobileMenuToggle";
import useAuthStatus from "@/hooks/useAuthStatus";
import useLogout from "@/hooks/useLogout";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, isAdmin } = useAuthStatus();
  const { handleLogout } = useLogout();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md py-4 z-50 fixed top-0 left-0 right-0 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isMobile ? (
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center">
              <NavbarLogo />
            </div>
            <div className="flex items-center gap-1 xs:gap-2 sm:gap-3">
              {/* Make buttons larger for accessibility and prevent overlap */}
              <div className="flex-shrink-0">
                <ThemeToggle />
              </div>
              <div className="flex-shrink-0">
                <MobileMenuToggle isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
              </div>
            </div>
          </div>
        ) : (
          <nav className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <NavbarLogo />
              <DesktopNavLinks isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <AuthButtons isLoggedIn={isLoggedIn} isAdmin={isAdmin} handleLogout={handleLogout} />
            </div>
          </nav>
        )}

        {isMobile && (
          <MobileNavLinks
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
            setIsMenuOpen={setIsMenuOpen}
            handleLogout={handleLogout}
            isMenuOpen={isMenuOpen}
          />
        )}
      </div>
    </header>
  );
};

export default Navbar;
