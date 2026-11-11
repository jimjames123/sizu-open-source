
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MoreMenuProps {
  items: { to: string; label: string }[];
}

const MoreMenu = ({ items }: MoreMenuProps) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isAnyActive = items.some(
    (item) => location.pathname.startsWith(item.to)
  );

  const handleClick = (to: string) => {
    setOpen(false);
    if (location.pathname === to) {
      window.scrollTo(0, 0);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={`hidden md:inline-flex items-center gap-1 text-sm font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sizu-red/50 rounded-sm ${
          isAnyActive ? "text-sizu-red" : "hover:text-sizu-red"
        }`}
      >
        More
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-44">
        {items.map((item) => (
          <DropdownMenuItem key={item.to} asChild>
            <Link
              to={item.to}
              onClick={() => handleClick(item.to)}
              className={`w-full cursor-pointer ${
                location.pathname.startsWith(item.to)
                  ? "text-sizu-red"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MoreMenu;
