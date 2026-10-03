import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar.jsx";
import { Topbar } from "./Topbar.jsx";
import { useStore } from "../../context/StoreContext.jsx";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sidebarPos = "left" } = useStore();
  const isRight = sidebarPos === "right";

  return (
    <div className="min-h-screen">
      <Sidebar
        open={sidebarOpen}
        close={() => setSidebarOpen(false)}
      />
      <div
        className={`transition-all duration-300 ${
          isRight ? "lg:pr-[270px] lg:pl-0" : "lg:pl-[270px] lg:pr-0"
        }`}
      >
        <Topbar menu={() => setSidebarOpen(true)} />
        <main className="w-full px-4 md:px-6 xl:px-8 pb-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
