import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Logo } from "../common/Logo.jsx";
import { Icon } from "../common/Icon.jsx";
import { useStore } from "../../context/StoreContext.jsx";
import { nav } from "../../data.js";

export function Sidebar({ open, close }) {
  const {
    logout,
    sidebarPos = "left",
    toggleSidebarPos,
    sidebarWidth = 270,
    setSidebarWidth,
    sidebarPinned = true,
    toggleSidebarPinned,
    isResizing,
    setIsResizing,
  } = useStore();

  const navigate = useNavigate();
  const isRight = sidebarPos === "right";

  // Clean up body styles if unmounted during dragging
  useEffect(() => {
    return () => {
      document.body.style.removeProperty("cursor");
      document.body.style.removeProperty("user-select");
    };
  }, []);

  // Handle pointer down on resize handle
  const handlePointerDown = (e) => {
    if (e.button !== 0) return; // Primary button only
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const onPointerMove = (moveEvt) => {
      moveEvt.preventDefault();
      const deltaX = moveEvt.clientX - startX;
      const nextWidth = isRight ? startWidth - deltaX : startWidth + deltaX;
      setSidebarWidth(nextWidth);
    };

    const onPointerUp = () => {
      setIsResizing(false);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      document.body.style.removeProperty("cursor");
      document.body.style.removeProperty("user-select");
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  return (
    <>
      {/* Mobile backdrop overlay - closed on mobile tap */}
      <div
        onClick={close}
        className={`fixed inset-0 z-30 bg-black/60 lg:hidden ${
          open ? "" : "hidden"
        }`}
      />

      <aside
        className={`fixed z-40 ${
          sidebarPinned
            ? `inset-y-0 ${
                isRight ? "right-0 border-l" : "left-0 border-r"
              } bg-[#090908] border-white/[.08]`
            : `inset-y-0 lg:inset-y-3 ${
                isRight
                  ? "right-0 lg:right-3 lg:border"
                  : "left-0 lg:left-3 lg:border"
              } bg-[#090908]/95 lg:bg-[#0e0d0b]/95 backdrop-blur-xl border-white/[.08] lg:border-amber-500/30 lg:rounded-2xl lg:shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(245,158,11,0.08)]`
        } flex flex-col ${
          isResizing
            ? "!transition-none"
            : "transition-all duration-300 ease-out"
        } ${
          open
            ? "translate-x-0"
            : isRight
              ? "translate-x-full lg:translate-x-0"
              : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          width: `min(${sidebarWidth}px, 90vw)`,
          backgroundImage:
            "radial-gradient(420px 320px at 0% 100%, rgba(216, 137, 36, 0.22), transparent)",
        }}
      >
        {/* Header with Logo */}
        <div className="h-[72px] px-4 sm:px-5 flex items-center border-b border-white/[.08] shrink-0">
          <Logo size={32} />
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

        {/* Clean Footer - Logout button */}
        <div className="p-3 border-t border-white/[.08] mt-auto shrink-0">
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-3 px-4 h-11 text-[14px] text-stone-400 hover:text-white hover:bg-white/[.04] rounded-xl w-full text-left transition cursor-pointer"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>

        {/* Resizable edge handle (VS Code / ChatGPT style) */}
        <div
          onPointerDown={handlePointerDown}
          title="Drag to resize sidebar width"
          aria-label="Resize sidebar"
          className={`absolute top-0 bottom-0 w-3 cursor-col-resize z-50 select-none hidden lg:flex items-center justify-center group ${
            isRight ? "left-0 -translate-x-1.5" : "right-0 translate-x-1.5"
          }`}
        >
          {/* Hairline highlight */}
          <div
            className={`w-[2px] h-full transition-colors duration-150 ${
              isResizing
                ? "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                : "bg-transparent group-hover:bg-amber-500/60"
            }`}
          />
          {/* Subtle center grip pill */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-full pointer-events-none transition-all duration-150 ${
              isResizing
                ? "bg-amber-400 opacity-100 scale-110 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                : "bg-white/20 group-hover:bg-amber-400 group-hover:opacity-100 opacity-0"
            }`}
          />
        </div>
      </aside>
    </>
  );
}
