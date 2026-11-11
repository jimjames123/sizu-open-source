
import { Link } from "react-router-dom";

const NavbarLogo = () => {
  return (
    <Link to="/" className="inline-block pl-2">
      <div className="flex flex-col items-start">
        <h1 className="sizu-logo-text">
          <span className="s">S</span>
          <span className="i">I</span>
          <span className="z">Z</span>
          <span className="u">U</span>
        </h1>
        <span className="text-xs text-gray-600 font-bold">Social Impact Zone Uganda</span>
      </div>
    </Link>
  );
};

export default NavbarLogo;
