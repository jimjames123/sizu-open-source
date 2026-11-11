import { Link, useLocation } from "react-router-dom";
import { Home, FolderKanban, HeartPulse, BriefcaseBusiness, Building2, Info, BookOpenText, Mail, LayoutDashboard, Plus, Settings, LogOut, ShieldCheck, X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";

interface MobileNavLinksProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  handleLogout: () => void;
  isMenuOpen: boolean;
}

const publicLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/femtech", label: "FemTech", icon: HeartPulse },
  { to: "/opportunities", label: "Opportunities", icon: BriefcaseBusiness },
  { to: "/vital-info", label: "Vital Info", icon: BookOpenText },
  { to: "/organizations", label: "Organizations", icon: Building2 },
  { to: "/about", label: "About SIZU", icon: Info },
  { to: "/contact", label: "Contact", icon: Mail },
];

const MobileNavLinks = ({ isLoggedIn, isAdmin, setIsMenuOpen, handleLogout, isMenuOpen }: MobileNavLinksProps) => {
  const location = useLocation();
  const close = () => setIsMenuOpen(false);
  const logout = () => { close(); handleLogout(); };
  const itemClass = (to: string) =>
    `flex min-h-11 items-center gap-3 rounded-xl px-3 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sizu-red ${location.pathname === to ? "bg-red-50 text-sizu-red dark:bg-red-950/30" : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"}`;
  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetContent side="left" className="flex h-[100dvh] w-[min(86vw,320px)] max-w-none flex-col gap-0 overflow-hidden border-r border-gray-200 bg-white p-0 shadow-xl dark:border-gray-800 dark:bg-gray-950 [&>button]:hidden">
        <div className="flex shrink-0 items-start justify-between border-b border-gray-100 px-5 pb-4 pt-6 dark:border-gray-800">
          <div>
            <SheetTitle className="text-left text-[26px] font-black tracking-tight text-gray-950 dark:text-white">
              SI<span className="text-sizu-red">Z</span>U
            </SheetTitle>
            <SheetDescription className="mt-0.5 text-left text-[11px] font-medium tracking-wide text-gray-500">
              Social Impact Zone Uganda
            </SheetDescription>
          </div>
          <button type="button" aria-label="Close navigation menu" onClick={close} className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Explore</p>
          <nav aria-label="Main navigation" className="space-y-0.5">
            {publicLinks.map(({to,label,icon:Icon}) => (
              <Link key={to} to={to} onClick={close} className={itemClass(to)} aria-current={location.pathname===to?"page":undefined}>
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8}/>{label}
              </Link>
            ))}
          </nav>

          {isLoggedIn && (
            <div className="mt-5 border-t border-gray-100 pt-4 dark:border-gray-800">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Workspace</p>
              <nav aria-label="Workspace navigation" className="space-y-0.5">
                <Link to="/dashboard" onClick={close} className={itemClass("/dashboard")}><LayoutDashboard className="h-[18px] w-[18px]"/>Dashboard</Link>
                <Link to="/dashboard/projects" onClick={close} className={itemClass("/dashboard/projects")}><FolderKanban className="h-[18px] w-[18px]"/>My Projects</Link>
                <Link to="/dashboard/profile" onClick={close} className={itemClass("/dashboard/profile")}><Settings className="h-[18px] w-[18px]"/>Edit Profile</Link>
                {isAdmin && <Link to="/admin" onClick={close} className={itemClass("/admin")}><ShieldCheck className="h-[18px] w-[18px]"/>Admin Panel</Link>}
              </nav>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-gray-100 bg-white px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 dark:border-gray-800 dark:bg-gray-950">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard/projects/add" onClick={close} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sizu-red px-4 text-sm font-semibold text-white transition-colors hover:bg-sizu-crimson">
                <Plus className="h-[18px] w-[18px]"/>Add Project
              </Link>
              <button type="button" onClick={logout} className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                <LogOut className="h-[17px] w-[17px]"/>Log out
              </button>
            </>
          ) : (
            <div className="space-y-2">
              <Link to="/login" onClick={close} className="flex min-h-11 items-center justify-center rounded-xl bg-sizu-red px-4 text-sm font-semibold text-white">Sign in to post</Link>
              <Link to="/register" onClick={close} className="flex min-h-11 items-center justify-center rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">Register organization</Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
export default MobileNavLinks;
