
import NavLink from "./NavLink";
import MoreMenu from "./MoreMenu";

interface DesktopNavLinksProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
}

const MORE_ITEMS = [
  { to: "/vital-info", label: "Vital Info" },
  { to: "/organizations", label: "Organizations" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const DesktopNavLinks = ({ isLoggedIn, isAdmin }: DesktopNavLinksProps) => {
  return (
    <div className="hidden md:flex space-x-6">
      <NavLink to="/" className="text-sm font-bold transition-colors">
        Home
      </NavLink>
      <NavLink to="/projects" className="text-sm font-bold transition-colors">
        Projects
      </NavLink>
      <NavLink to="/femtech" className="text-sm font-bold transition-colors">
        FemTech
      </NavLink>
      <NavLink to="/opportunities" className="text-sm font-bold transition-colors">
        Opportunities
      </NavLink>
      <MoreMenu items={MORE_ITEMS} />
      {isLoggedIn && (
        <NavLink to="/dashboard" className="text-sm font-bold transition-colors">
          Project Panel
        </NavLink>
      )}

    </div>
  );
};

export default DesktopNavLinks;

