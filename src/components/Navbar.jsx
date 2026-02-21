import { Link, useLocation } from "../lib/simpleRouter";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, Menu, Video } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import Avatar from "./Avatar";
import useLogout from "../hooks/useLogout";

import { DEFAULT_AVATAR } from "../constants";

const Navbar = ({ toggleSidebar, isSidebarOpen, showSidebarToggle }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            {/* MOBILE HAMBURGER TOGGLE */}
            {showSidebarToggle && (
              <button onClick={toggleSidebar} className="btn btn-ghost btn-circle lg:hidden">
                <Menu className="h-6 w-6 text-base-content" />
              </button>
            )}

            {/* LOGO - ONLY IN THE CHAT PAGE or if Sidebar is closed */}
            {(isChatPage || (showSidebarToggle && !isSidebarOpen)) && (
              <div className="">
                <Link to="/" className="flex items-center gap-2.5">
                  {/* Show Icon ONLY on Chat Page (no sidebar) */}
                  {isChatPage && <Video className="w-8 h-8 text-primary" />}
                  <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                    VidiChat
                  </span>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>

          {/* TODO */}
          <ThemeSelector />

          <div className="avatar cursor-pointer">
            <Link to="/profile">
              <Avatar src={authUser?.profilePic} size="tiny" className="ring-2 ring-primary ring-offset-base-100 ring-offset-1" />
            </Link>
          </div>

          {/* Logout button */}
          <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
