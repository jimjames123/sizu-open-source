
import { Menu, X } from "lucide-react";

interface MobileMenuToggleProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const MobileMenuToggle = ({ isMenuOpen, toggleMenu }: MobileMenuToggleProps) => {
  return (
    <button
      onClick={toggleMenu}
      className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sizu-red transition-all"
      aria-expanded={isMenuOpen}
      aria-label="Toggle menu"
    >
      {isMenuOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <Menu className="h-6 w-6" />
      )}
    </button>
  );
};

export default MobileMenuToggle;
