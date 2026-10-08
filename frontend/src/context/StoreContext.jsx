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
  womenCats,
  menCats,
  womenProducts,
  menProducts,
  normalizeCategory,
  isFemaleUser,
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
  const [removedIds, setRemovedIds] = useState(() => readCache("mmr_removed_items", []));
  const [catalog, setCatalog] = useState(initialCatalog);
  const [sidebarPos, setSidebarPos] = useState(
    () => localStorage.getItem("mmr_sidebar_pos") || "left",
  );
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = Number(localStorage.getItem("mmr_sidebar_width"));
    return Number.isFinite(saved) && saved >= 220 && saved <= 480 ? saved : 270;
  });
  const [sidebarPinned, setSidebarPinned] = useState(() => {
    const saved = localStorage.getItem("mmr_sidebar_pinned");
    return saved === null ? true : saved !== "false";
  });
  const [isResizing, setIsResizing] = useState(false);

  const toggleSidebarPos = () => {
    setSidebarPos((prev) => {
      const next = prev === "left" ? "right" : "left";
      localStorage.setItem("mmr_sidebar_pos", next);
      return next;
    });
  };

  const updateSidebarWidth = (width) => {
    const clamped = Math.max(220, Math.min(480, Math.round(width)));
    setSidebarWidth(clamped);
    localStorage.setItem("mmr_sidebar_width", String(clamped));
  };

  const toggleSidebarPinned = () => {
    setSidebarPinned((prev) => {
      const next = !prev;
      localStorage.setItem("mmr_sidebar_pinned", String(next));
      return next;
    });
  };

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
    localStorage.setItem("mmr_removed_items", JSON.stringify(removedIds));
    if (user) {
      localStorage.setItem("makeMeReadyUser", JSON.stringify(user));
    }
  }, [favs, saved, cart, added, removedIds, user]);

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

  const quickLogin = async () => {
    try {
      const session = await apiRequest("/api/auth/quick-login", {
        method: "POST",
        auth: false,
      });
      return applySession(session);
    } catch (err) {
      console.warn("Backend quick-login failed, using instant demo session:", err.message);
      const demoUser = {
        id: "demo-user-sahil",
        name: "Sahil Khot",
        email: "sahil@makemeready.in",
        city: "Mumbai",
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
      };
      const demoSession = {
        token: "demo_token_" + Date.now(),
        user: demoUser,
      };
      return applySession(demoSession);
    }
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
    let updatedUser = { ...(user || {}), ...profileData };
    try {
      if (token) {
        const result = await apiRequest("/api/profile", {
          method: "PATCH",
          body: profileData,
          auth: true,
        });
        if (result?.user) {
          updatedUser = result.user;
        }
      }
    } catch (err) {
      console.warn("Profile update saved locally:", err.message);
    }
    setUser(updatedUser);
    localStorage.setItem("makeMeReadyUser", JSON.stringify(updatedUser));
    return updatedUser;
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
    if (!product) return;
    const prodId = product.id || product.productId;

    setCart((prev) => {
      // Prevent duplicate entries
      if (prev.some((item) => (item.id || item.productId) === prodId)) {
        return prev;
      }
      return [
        {
          id: prodId,
          productId: prodId,
          name: product.name,
          price: product.price,
          cat: product.cat || product.category || "General",
          img: product.img || product.image || "/img/hero-wardrobe-luxury.jpg",
          brand: product.brand || "",
          gender: product.gender || (product.g === "Women" ? "Female" : "Male"),
        },
        ...prev,
      ];
    });

    if (token) {
      try {
        const result = await apiRequest("/api/cart", {
          method: "POST",
          body: { id: prodId },
          auth: true,
        });
        if (result?.cart) {
          setCart(result.cart);
        }
      } catch (err) {
        console.warn("Cart synced locally:", err.message);
      }
    }
  };

  const removeFromCart = async (productId) => {
    setCart((prev) =>
      prev.filter((item) => (item.id || item.productId) !== productId)
    );
  };

  const isInCart = (productId) => {
    if (!productId) return false;
    return cart.some((item) => (item.id || item.productId) === productId);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem("mmr_cart", JSON.stringify([]));
  };

  const addToWardrobe = async (product) => {
    if (!product) return;
    const prodId = product.id || product.productId;

    // Prevent duplicate additions
    if (added.some((item) => (item.id || item.productId) === prodId)) {
      return;
    }

    const isFem = isFemaleUser(user);
    const itemCat = normalizeCategory(
      product.cat || product.category,
      product.gender || (isFem ? "Female" : "Male")
    );

    const newItem = {
      id: prodId,
      productId: prodId,
      name: product.name,
      cat: itemCat,
      category: itemCat,
      tag: product.tag || "Casual",
      brand: product.brand || "",
      color: product.color || "",
      size: product.size || "",
      img: product.img || product.image || "/img/hero-wardrobe-luxury.jpg",
      image: product.img || product.image || "/img/hero-wardrobe-luxury.jpg",
      price: product.price,
      gender: product.gender || (product.g === "Women" ? "Female" : "Male"),
      addedAt: new Date().toISOString(),
    };

    setAdded((prev) => [newItem, ...prev]);

    // Remove from removedIds if previously deleted
    setRemovedIds((prev) => prev.filter((id) => id !== prodId));

    if (token) {
      try {
        const body = new FormData();
        body.append("name", newItem.name);
        body.append("cat", newItem.cat);
        body.append("tag", newItem.tag);
        body.append("brand", newItem.brand);
        body.append("price", String(newItem.price || 0));
        body.append("imageFile", newItem.img);

        await apiRequest("/api/wardrobe", {
          method: "POST",
          body,
          auth: true,
        });
      } catch (err) {
        console.warn("Wardrobe item saved locally:", err.message);
      }
    }
  };

  const isInWardrobe = (productId) => {
    if (!productId) return false;
    return added.some((item) => (item.id || item.productId) === productId);
  };

  const isSaved = (productId) => {
    if (!productId) return false;
    return (
      saved.includes(productId) ||
      favs.includes(productId) ||
      saved.includes(`p-${productId}`) ||
      favs.includes(`p-${productId}`)
    );
  };

  const addItem = async (item, image) => {
    let dataUrl = "";
    if (image instanceof Blob || image instanceof File) {
      dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => resolve("");
        reader.readAsDataURL(image);
      });
    } else if (typeof image === "string") {
      dataUrl = image;
    }

    const localId = "user-item-" + Date.now();
    const localItem = {
      id: localId,
      name: item.name.trim(),
      cat: item.cat,
      tag: item.tag || "Casual",
      brand: item.brand?.trim() || "",
      color: item.color?.trim() || "",
      size: item.size?.trim() || "",
      img: dataUrl || "/img/hero-wardrobe-luxury.jpg",
    };

    setAdded((current) => [localItem, ...current]);

    if (token) {
      try {
        const body = new FormData();
        for (const [key, value] of Object.entries(item)) {
          body.append(key, value);
        }
        if (image instanceof File) {
          body.append("image", image);
        }
        const result = await apiRequest("/api/wardrobe", {
          method: "POST",
          body,
          auth: true,
        });
        if (result?.item) {
          setAdded((current) =>
            current.map((w) =>
              w.id === localId
                ? { ...result.item, img: dataUrl || result.item.img }
                : w,
            ),
          );
          return result.item;
        }
      } catch (err) {
        console.warn("Item persisted locally:", err.message);
      }
    }

    return localItem;
  };

  const removeItem = async (id) => {
    // 1. Remove from local added state
    setAdded((current) => current.filter((item) => item.id !== id));
    // 2. Add to removedIds state & localStorage
    setRemovedIds((current) => {
      const next = current.includes(id) ? current : [...current, id];
      localStorage.setItem("mmr_removed_items", JSON.stringify(next));
      return next;
    });

    // 3. If online & authenticated, notify backend
    if (token) {
      try {
        await apiRequest(`/api/wardrobe/${encodeURIComponent(id)}`, {
          method: "DELETE",
          auth: true,
        });
      } catch (err) {
        console.warn("Remote deletion note:", err.message);
      }
    }
    return true;
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    return apiRequest("/api/change-password", {
      method: "POST",
      body: { currentPassword, newPassword },
      auth: true,
    });
  };

  const fallbackUser = user || { name: "Your Style", email: "" };
  const isFemale = isFemaleUser(fallbackUser);
  const userGender = isFemale ? "Female" : (fallbackUser?.gender || fallbackUser?.profile?.gender || "Male");

  const filteredCatalog = {
    ...catalog,
    wardrobe: (catalog.wardrobe || []).filter((w) => !removedIds.includes(w.id)),
  };

  const filteredAdded = added.filter((w) => !removedIds.includes(w.id));

  return (
    <StoreContext.Provider
      value={{
        user: fallbackUser,
        authed: Boolean(token),
        token,
        login,
        quickLogin,
        register,
        logout,
        updateProfile,
        changePassword,
        favs,
        toggleFav: toggleRemote("favs", "/api/favorites", "favorites"),
        saved,
        toggleSave: toggleRemote("saved", "/api/saved-looks", "savedLooks"),
        isSaved,
        cart,
        addCart,
        removeFromCart,
        isInCart,
        clearCart,
        added: filteredAdded,
        addItem,
        addToWardrobe,
        isInWardrobe,
        removeItem,
        removedIds,
        catalog: filteredCatalog,
        sidebarPos,
        setSidebarPos,
        toggleSidebarPos,
        sidebarWidth,
        setSidebarWidth: updateSidebarWidth,
        sidebarPinned,
        setSidebarPinned,
        toggleSidebarPinned,
        isResizing,
        setIsResizing,
        isFemale,
        userGender,
        womenCats,
        menCats,
        womenProducts,
        menProducts,
        products,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export default Store;
