import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar.jsx";
import { Topbar } from "./Topbar.jsx";
import { useStore } from "../../context/StoreContext.jsx";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    sidebarPos = "left",
    sidebarWidth = 270,
    sidebarPinned = true,
    isResizing = false,
  } = useStore();
  const isRight = sidebarPos === "right";

  const paddingStyle = {
    paddingLeft: sidebarPinned && !isRight ? `${sidebarWidth}px` : "0px",
    paddingRight: sidebarPinned && isRight ? `${sidebarWidth}px` : "0px",
  };

  return (
    <div className="min-h-screen">
      <Sidebar
        open={sidebarOpen}
        close={() => setSidebarOpen(false)}
      />
      <div
        style={paddingStyle}
        className={`w-full ${
          isResizing
            ? "!transition-none"
            : "transition-[padding] duration-300 ease-out"
        } max-lg:!pl-0 max-lg:!pr-0`}
      >
        <Topbar menu={() => setSidebarOpen(true)} />
        <main className="w-full px-4 md:px-6 xl:px-8 pb-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
