import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar.jsx";
import { Topbar } from "./Topbar.jsx";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar
        open={sidebarOpen}
        close={() => setSidebarOpen(false)}
      />
      <div className="lg:pl-[190px]">
        <Topbar menu={() => setSidebarOpen(true)} />
        <main className="w-full px-4 md:px-6 xl:px-8 pb-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
