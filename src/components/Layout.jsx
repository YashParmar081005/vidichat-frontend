import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Close sidebar on mobile by default
    if (window.innerWidth < 1024) { // lg breakpoint
      setIsSidebarOpen(false);
    }
  }, []);

  return (
    <div className="h-full flex overflow-hidden relative">
      {/* MOBILE SIDEBAR OVERLAY */}
      {showSidebar && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {showSidebar && (
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      )}

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} showSidebarToggle={showSidebar} />

        <main className="flex-1 overflow-y-auto bg-base-100 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};
export default Layout;
