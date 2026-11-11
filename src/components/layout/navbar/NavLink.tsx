
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const NavLink = ({ to, children, onClick, className = "" }: NavLinkProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    return path !== "/" && location.pathname.startsWith(path);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
    // Scroll to top when navigating to the same page
    if (location.pathname === to) {
      window.scrollTo(0, 0);
    }
  };

  return (
    <Link
      to={to}
      className={`${className} ${
        isActive(to) 
          ? "text-sizu-red border-b-2 border-sizu-red" 
          : "hover:text-sizu-red"
      }`}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

export default NavLink;
