import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, Bell, ChevronDown, ShoppingBag } from "lucide-react";
import { useStore } from "../../context/StoreContext.jsx";
import { occasions } from "../../data.js";
import { IMG } from "../../data/constants.js";

export function Topbar({ menu }) {
  const { user, logout, cart = [] } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchResults = searchQuery
    ? occasions
        .filter((o) =>
          o.title.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .slice(0, 5)
    : [];

  const displayName = user?.name || "User";

  return (
    <header className="h-[68px] flex items-center gap-4 px-4 md:px-6 xl:px-8 relative z-20">
      <button
        type="button"
        aria-label="Menu"
        className="lg:hidden text-white"
        onClick={menu}
      >
        <Menu size={22} />
      </button>

      <div className="relative flex-1 max-w-[620px]">
        <label className="sr-only" htmlFor="gs">
          Search
        </label>
        <Search
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-acc"
        />
        <input
          id="gs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for outfits, occasions, brands..."
          className="inp h-10 pl-11 bg-card/80"
        />
        {searchResults.length > 0 && (
          <div className="absolute top-12 inset-x-0 card p-2 bg-[#111] z-50">
            {searchResults.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  navigate("/occasions");
                }}
                className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/5 text-left text-sm"
              >
                <img
                  src={o.img}
                  alt=""
                  className="w-8 h-8 rounded object-cover"
                />
                {o.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          aria-label="Shopping Cart"
          onClick={() => navigate("/shopping")}
          title={`Cart (${cart.length} items)`}
          className="relative grid place-items-center w-10 h-10 rounded-full border border-line bg-card text-mute hover:text-white hover:border-amber-500/50 transition cursor-pointer"
        >
          <ShoppingBag size={17} />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-black font-bold text-[10px] flex items-center justify-center shadow-md animate-up">
              {cart.length}
            </span>
          )}
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative grid place-items-center w-10 h-10 rounded-full border border-line bg-card text-mute hover:text-white"
        >
          <Bell size={17} />
          <i className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-acc" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5"
          >
            <img
              src={user?.avatar || IMG.avatar}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover border border-line2"
            />
            <span className="hidden sm:block text-sm font-medium">
              {displayName}
            </span>
            <ChevronDown size={15} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-44 card p-1.5 bg-[#111] z-50 animate-up shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/profile");
                }}
                className="w-full text-left text-sm p-2.5 rounded-lg hover:bg-white/5"
              >
                My Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                  navigate("/login");
                }}
                className="w-full text-left text-sm p-2.5 rounded-lg hover:bg-white/5 text-red-400"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
