
import { Link } from "react-router-dom";
import { Upload, LogIn, UserPlus } from "lucide-react";
import UserDropdownMenu from "./UserDropdownMenu";
import NavLink from "./NavLink";
import useLogout from "@/hooks/useLogout";

interface AuthButtonsProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  handleLogout: () => void;
}

const AuthButtons = ({ isLoggedIn, isAdmin }: AuthButtonsProps) => {
  const { handleLogout } = useLogout();
  
  return (
    <div className="flex items-center space-x-4">
      {isLoggedIn ? (
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/projects/add"
            className="bg-sizu-red text-white flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-300 hover:bg-sizu-crimson hover:shadow-lg"
          >
            <Upload className="h-4 w-4" />
            Add Project
          </Link>
          <UserDropdownMenu isAdmin={isAdmin} handleLogout={handleLogout} />
        </div>
      ) : (
        <>
          <Link
            to="/register"
            className="border border-gray-300 hover:border-sizu-red text-gray-700 hover:text-sizu-red flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-300"
          >
            <UserPlus className="h-4 w-4" />
            Register Organization
          </Link>
          <Link
            to="/login"
            className="bg-sizu-red text-white flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-300 hover:bg-sizu-crimson hover:shadow-lg"
          >
            <LogIn className="h-4 w-4" />
            Post Project
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthButtons;
