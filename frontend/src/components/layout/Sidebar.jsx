import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, ArrowLeftRight } from "lucide-react";
import { Logo } from "../common/Logo.jsx";
import { Icon } from "../common/Icon.jsx";
import { useStore } from "../../context/StoreContext.jsx";
import { nav } from "../../data.js";

export function Sidebar({ open, close }) {
  const { logout, sidebarPos = "left", toggleSidebarPos } = useStore();
  const navigate = useNavigate();
  const isRight = sidebarPos === "right";

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 z-30 bg-black/60 lg:hidden ${open ? "" : "hidden"}`}
      />
      <aside
        className={`fixed z-40 inset-y-0 ${
          isRight ? "right-0 border-l" : "left-0 border-r"
        } w-[270px] bg-[#090908] border-white/[.08] flex flex-col transition-all duration-300 ease-out ${
          open
            ? "translate-x-0"
            : isRight
              ? "translate-x-full lg:translate-x-0"
              : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(420px 320px at 0% 100%, rgba(216, 137, 36, 0.22), transparent)",
        }}
      >
        {/* Header with Logo and Shift Button */}
        <div className="h-[72px] px-5 flex items-center justify-between border-b border-white/[.08]">
          <Logo size={32} />
          <button
            type="button"
            onClick={toggleSidebarPos}
            title={isRight ? "Shift sidebar to Left" : "Shift sidebar to Right"}
            className="p-2 rounded-xl text-mute hover:text-acc hover:bg-white/[.04] transition border border-transparent hover:border-line2 flex items-center gap-1.5 text-xs"
          >
            <ArrowLeftRight size={15} />
            <span className="hidden xl:inline text-[11px] text-mute capitalize">
              {isRight ? "Dock Left" : "Dock Right"}
            </span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 mt-2 space-y-1.5 flex-1 overflow-y-auto">
          {nav.map(([label, to, iconName]) => (
            <NavLink
              key={to}
              to={to}
              onClick={close}
              className={({ isActive }) =>
                `flex items-center gap-3.5 h-12 px-4 rounded-2xl text-[15px] font-medium transition duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-acc/25 via-acc/15 to-acc/[.05] border border-acc/45 text-white shadow-[0_0_20px_rgba(255,159,47,.18)]"
                    : "text-stone-400 hover:text-white hover:bg-white/[.04] border border-transparent"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    n={iconName}
                    size={20}
                    className={isActive ? "text-acc" : "text-stone-400"}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Clean Footer - No promo cards or "Explore Now" text */}
        <div className="p-3 border-t border-white/[.08] mt-auto">
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-3 px-4 h-11 text-[14px] text-stone-400 hover:text-white hover:bg-white/[.04] rounded-xl w-full text-left transition"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
