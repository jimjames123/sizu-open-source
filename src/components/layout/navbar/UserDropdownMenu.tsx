
import { Link } from "react-router-dom";
import { LayoutDashboard, Upload, Settings, LogOut, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

interface UserDropdownMenuProps {
  isAdmin: boolean;
  handleLogout: () => void;
}

const UserDropdownMenu = ({ isAdmin, handleLogout }: UserDropdownMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-sm font-bold transition-colors hover:text-sizu-red flex items-center gap-1">
        <User className="h-4 w-4" />
        {isAdmin ? "Admin" : "My Account"}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border shadow-lg rounded-md p-1 w-48">
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-100 transition-colors w-full cursor-pointer">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard/projects" className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-100 transition-colors w-full cursor-pointer">
            <Upload className="h-4 w-4" />
            My Projects
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard/profile" className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-100 transition-colors w-full cursor-pointer">
            <Settings className="h-4 w-4" />
            Edit Profile
          </Link>
        </DropdownMenuItem>
        
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin" className="flex items-center gap-2 py-2 px-3 rounded-md text-blue-600 hover:bg-blue-50 transition-colors w-full cursor-pointer">
                <Shield className="h-4 w-4" />
                Admin Panel
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="flex items-center gap-2 py-2 px-3 rounded-md text-red-600 hover:bg-gray-100 transition-colors w-full cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdownMenu;
