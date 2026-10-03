import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Logo } from "../common/Logo.jsx";
import { Icon } from "../common/Icon.jsx";
import { useStore } from "../../context/StoreContext.jsx";
import { nav } from "../../data.js";

export function Sidebar({ open, close }) {
  const { logout } = useStore();
  const navigate = useNavigate();

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 z-30 bg-black/60 lg:hidden ${open ? "" : "hidden"}`}
      />
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-[190px] bg-[#090908] border-r border-white/[.08] flex flex-col transition-transform duration-300 ease-out ${
          open ? "" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{
          backgroundImage:
            "radial-gradient(300px 260px at 0% 100%,rgba(216,137,36,.24),transparent)",
        }}
      >
        <div className="h-[68px] px-4 flex items-center border-b border-white/[.08]">
          <Logo size={30} />
        </div>
        <nav className="p-2.5 mt-3 space-y-1">
          {nav.map(([label, to, iconName]) => (
            <NavLink
              key={to}
              to={to}
              onClick={close}
              className={({ isActive }) =>
                `flex items-center gap-3 h-11 px-3 rounded-xl text-[13px] transition duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-acc/25 to-acc/[.06] border border-acc/35 text-white shadow-[0_0_18px_rgba(255,159,47,.1)]"
                    : "text-mute hover:text-white hover:bg-white/[.04] border border-transparent"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    n={iconName}
                    size={18}
                    className={isActive ? "text-acc" : ""}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto p-3">
          <div className="card p-4 mb-3 bg-gradient-to-br from-acc/15 to-transparent border-acc/30">
            <div className="font-serif text-acc leading-tight">
              Upgrade Your
              <br />
              <span className="text-white">Style Game</span>
            </div>
            <p className="text-[11px] text-mute my-2">
              Premium brands curated for you.
            </p>
            <button
              type="button"
              onClick={() => navigate("/shopping")}
              className="btn-p h-8 px-4 text-xs"
            >
              Explore Now
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-3 px-4 h-10 text-sm text-dim hover:text-white w-full text-left"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
