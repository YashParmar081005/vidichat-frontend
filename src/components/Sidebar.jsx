import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, UsersIcon, Menu, Video, Gamepad2, Trophy, Rocket } from "lucide-react";
import Avatar from "./Avatar";

import { DEFAULT_AVATAR } from "../constants";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 bg-base-200 border-r border-base-300 flex flex-col h-full transition-all duration-300
        ${isOpen ? "translate-x-0 w-72" : "-translate-x-full w-72"} 
        lg:static lg:translate-x-0 ${isOpen ? "lg:w-64" : "lg:w-20"}
      `}
    >
      <div className="p-5 border-b border-base-300 flex items-center justify-center">
        <Link to="/" className="flex items-center gap-2.5">
          <Video className="w-8 h-8 text-primary" />
          {isOpen && (
            <span className="text-xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider whitespace-nowrap">
              VidiChat
            </span>
          )}
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/"
          className={`btn btn-ghost ${isOpen ? "justify-start" : "justify-center"} w-full gap-3 px-2 normal-case ${currentPath === "/" ? "btn-active" : ""}`}
          onClick={() => window.innerWidth < 1024 && toggleSidebar()}
        >
          <HomeIcon className="size-6 text-base-content opacity-70" />
          {isOpen && <span>Home</span>}
        </Link>

        <Link
          to="/friends"
          className={`btn btn-ghost ${isOpen ? "justify-start" : "justify-center"} w-full gap-3 px-2 normal-case ${currentPath === "/friends" ? "btn-active" : ""}`}
          onClick={() => window.innerWidth < 1024 && toggleSidebar()}
        >
          <UsersIcon className="size-6 text-base-content opacity-70" />
          {isOpen && <span>Friends</span>}
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost ${isOpen ? "justify-start" : "justify-center"} w-full gap-3 px-2 normal-case ${currentPath === "/notifications" ? "btn-active" : ""}`}
          onClick={() => window.innerWidth < 1024 && toggleSidebar()}
        >
          <BellIcon className="size-6 text-base-content opacity-70" />
          {isOpen && <span>Notifications</span>}
        </Link>

        <Link
          to="/arcade"
          className={`btn btn-ghost ${isOpen ? "justify-start" : "justify-center"} w-full gap-3 px-2 normal-case ${currentPath.startsWith("/arcade") ? "btn-active" : ""}`}
          onClick={() => window.innerWidth < 1024 && toggleSidebar()}
        >
          <Gamepad2 className="size-6 text-base-content opacity-70" />
          {isOpen && <span>Arcade</span>}
        </Link>

        <Link
          to="/leaderboard"
          className={`btn btn-ghost ${isOpen ? "justify-start" : "justify-center"} w-full gap-3 px-2 normal-case ${currentPath === "/leaderboard" ? "btn-active" : ""}`}
          onClick={() => window.innerWidth < 1024 && toggleSidebar()}
        >
          <Trophy className="size-6 text-base-content opacity-70" />
          {isOpen && <span>Leaderboard</span>}
        </Link>

        <Link
          to="/avatar"
          className={`btn btn-ghost ${isOpen ? "justify-start" : "justify-center"} w-full gap-3 px-2 normal-case ${currentPath === "/avatar" ? "btn-active" : ""}`}
          onClick={() => window.innerWidth < 1024 && toggleSidebar()}
        >
          <Rocket className="size-6 text-base-content opacity-70" />
          {isOpen && <span>Avatar World</span>}
        </Link>
      </nav>

      <div className="p-4 border-t border-base-300 mt-auto flex flex-col gap-4">
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`btn btn-ghost ${isOpen ? "justify-start" : "justify-center"} w-full gap-3 px-2 hidden lg:flex`}
        >
          <Menu className="size-6 text-base-content" />
          {isOpen && <span>Collapse</span>}
        </button>

        {/* User Profile */}
        <div className={`flex items-center ${isOpen ? "gap-3" : "justify-center"}`}>
          <div className="avatar">
            <Avatar src={authUser?.profilePic} size="small" className="ring ring-primary ring-offset-base-100 ring-offset-2" />
          </div>
          {isOpen && (
            <div className="flex-1 overflow-hidden">
              <Link to="/profile" className="font-semibold text-sm hover:underline truncate block">
                {authUser?.fullName}
              </Link>
              <p className="text-xs text-success flex items-center gap-1">
                <span className="size-2 rounded-full bg-success inline-block" />
                Online
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
