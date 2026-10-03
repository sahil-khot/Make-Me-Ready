import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../api/client.js";
import {
  brands,
  cats,
  colors,
  lookTabs,
  looks,
  occasions,
  products,
  shopCats,
  styles,
  wardrobe,
} from "../data.js";

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

const readCache = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const initialCatalog = {
  brands,
  cats,
  colors,
  lookTabs,
  looks,
  occasions,
  products,
  shopCats,
  styles,
  wardrobe,
};

export function Store({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("mmr_token"));
  const [user, setUser] = useState(() => readCache("makeMeReadyUser", null));
  const [favs, setFavs] = useState(() => readCache("mmr_favs", []));
  const [saved, setSaved] = useState(() => readCache("mmr_saved", []));
  const [cart, setCart] = useState(() => readCache("mmr_cart", []));
  const [added, setAdded] = useState(() => readCache("mmr_added", []));
  const [catalog, setCatalog] = useState(initialCatalog);

  // Fetch catalog from API on mount
  useEffect(() => {
    let isMounted = true;
    apiRequest("/api/catalog", { auth: false })
      .then((data) => {
        if (isMounted && data) {
          setCatalog({
            ...initialCatalog,
            ...(data.config || {}),
            ...data,
          });
        }
      })
      .catch((error) => {
        console.warn("Using fallback local catalog:", error.message);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync state with backend when authenticated
  useEffect(() => {
    if (!token) return;
    let isMounted = true;

    apiRequest("/api/state", { auth: true })
      .then((state) => {
        if (!isMounted || !state) return;
        if (state.user) setUser(state.user);
        if (Array.isArray(state.favorites)) setFavs(state.favorites);
        if (Array.isArray(state.savedLooks)) setSaved(state.savedLooks);
        if (Array.isArray(state.cart)) setCart(state.cart);
        if (Array.isArray(state.wardrobe)) setAdded(state.wardrobe);
      })
      .catch((err) => {
        // ONLY log out if the session is actually expired/invalid (401)
        if (err.status === 401) {
          console.warn("Session expired or invalid. Logging out.");
          localStorage.removeItem("mmr_token");
          localStorage.removeItem("makeMeReadyUser");
          if (isMounted) {
            setToken(null);
            setUser(null);
          }
        } else {
          console.warn("Could not sync remote state:", err.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Persist local state
  useEffect(() => {
    localStorage.setItem("mmr_favs", JSON.stringify(favs));
    localStorage.setItem("mmr_saved", JSON.stringify(saved));
    localStorage.setItem("mmr_cart", JSON.stringify(cart));
    localStorage.setItem("mmr_added", JSON.stringify(added));
    if (user) {
      localStorage.setItem("makeMeReadyUser", JSON.stringify(user));
    }
  }, [favs, saved, cart, added, user]);

  const applySession = (session) => {
    if (!session || !session.token) {
      throw new Error("Invalid session received from server.");
    }
    localStorage.setItem("mmr_token", session.token);
    if (session.user) {
      localStorage.setItem("makeMeReadyUser", JSON.stringify(session.user));
      setUser(session.user);
    }
    setToken(session.token);
    return session.user;
  };

  const login = async (credentials) => {
    const session = await apiRequest("/api/auth/login", {
      method: "POST",
      body: credentials,
      auth: false,
    });
    return applySession(session);
  };

  const register = async (profile) => {
    const session = await apiRequest("/api/auth/register", {
      method: "POST",
      body: profile,
      auth: false,
    });
    return applySession(session);
  };

  const logout = () => {
    localStorage.removeItem("mmr_token");
    localStorage.removeItem("makeMeReadyUser");
    localStorage.removeItem("makeMeReadyAuthenticated");
    setToken(null);
    setUser(null);
    setFavs([]);
    setSaved([]);
    setCart([]);
    setAdded([]);
  };

  const updateProfile = async (profileData) => {
    const result = await apiRequest("/api/profile", {
      method: "PATCH",
      body: profileData,
      auth: true,
    });
    if (result?.user) {
      setUser(result.user);
      localStorage.setItem("makeMeReadyUser", JSON.stringify(result.user));
      return result.user;
    }
    return user;
  };

  const toggleRemote = (key, path, responseKey) => async (id) => {
    const setter = key === "favs" ? setFavs : setSaved;
    const current = key === "favs" ? favs : saved;
    const next = current.includes(id)
      ? current.filter((value) => value !== id)
      : [...current, id];

    setter(next);

    try {
      const result = await apiRequest(path, {
        method: "PUT",
        body: { id },
        auth: true,
      });
      if (result && result[responseKey]) {
        setter(result[responseKey]);
      }
    } catch (error) {
      setter(current); // Revert on failure
      throw error;
    }
  };

  const addCart = async (product) => {
    const result = await apiRequest("/api/cart", {
      method: "POST",
      body: { id: product.id },
      auth: true,
    });
    if (result?.cart) {
      setCart(result.cart);
    }
  };

  const addItem = async (item, image) => {
    const body = new FormData();
    for (const [key, value] of Object.entries(item)) {
      body.append(key, value);
    }
    if (image) {
      body.append("image", image);
    }

    const result = await apiRequest("/api/wardrobe", {
      method: "POST",
      body,
      auth: true,
    });

    if (result?.item) {
      setAdded((current) => [result.item, ...current]);
      return result.item;
    }
    throw new Error("Failed to add wardrobe item.");
  };

  const fallbackUser = user || { name: "Your Style", email: "" };

  return (
    <StoreContext.Provider
      value={{
        user: fallbackUser,
        authed: Boolean(token),
        token,
        login,
        register,
        logout,
        updateProfile,
        favs,
        toggleFav: toggleRemote("favs", "/api/favorites", "favorites"),
        saved,
        toggleSave: toggleRemote("saved", "/api/saved-looks", "savedLooks"),
        cart,
        addCart,
        added,
        addItem,
        catalog,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export default Store;
