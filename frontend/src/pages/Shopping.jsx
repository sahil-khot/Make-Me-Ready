import { useState } from "react";
import {
  Star,
  ShoppingBag,
  Truck,
  ShieldCheck,
  BadgeCheck,
  Headphones,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Section, Heart, Modal } from "../ui.jsx";
import { useStore } from "../store.jsx";
import { IMG, getImg } from "../data/constants.js";

const P = ({ p, add, i }) => (
  <div className="card overflow-hidden hover:-translate-y-1 animate-up">
    <div className="group tile relative aspect-[4/3.2] overflow-hidden">
      <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
      <Heart id={"p-" + p.id} cls="absolute top-2 right-2" />
    </div>
    <div className="p-3">
      <div className="font-serif font-semibold text-sm">{p.name}</div>
      <div className="text-sm font-medium">
        ₹{p.price.toLocaleString("en-IN")}
      </div>
      <div className="text-xs text-mute flex items-center gap-1 mb-3">
        <Star size={12} className="fill-acc text-acc" />
        {p.rating} ({p.reviews})
      </div>
      <button onClick={() => add(p)} className="btn-p h-9 w-full text-xs">
        <ShoppingBag size={13} />
        Add to Cart
      </button>
    </div>
  </div>
);
export default function Shopping() {
  const { addCart, cart, catalog, user } = useStore();
  const { products, shopCats, brands } = catalog;
  const [g, setG] = useState("All");
  const [toast, setToast] = useState(null);
  const [cartOpen, setCO] = useState(false);
  const [cat, setCat] = useState(null);

  // Gender detection for smart ordering
  const userGender = user?.profile?.gender || "";
  const isFemale = userGender.toLowerCase() === "female" || userGender.toLowerCase() === "f";

  // Get 22 women looks for the featured showcase strip
  const womenOutfitStrip = (catalog?.looks || []).filter(
    (l) => l.gender === "Women" || l.id?.includes("-w")
  );
  const add = async (p) => {
    try {
      await addCart(p);
      setToast(`${p.name} added to cart`);
    } catch (err) {
      setToast(err.message);
    }
    setTimeout(() => setToast(null), 2400);
  };

  // Filtered products across categories
  const filteredProducts = (products || []).filter(
    (p) =>
      (g === "All" ||
        p.g === g ||
        (g === "Accessories" && p.cat === "Accessories") ||
        (g === "Jewelry" && p.cat === "Jewelry")) &&
      (!cat || p.cat === cat),
  );
  const na = filteredProducts.slice(0, 15);
  const trending = filteredProducts.length > 15 ? filteredProducts.slice(15) : (products || []).slice(10, 25);
  const total = cart.reduce((s, p) => s + p.price, 0);

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl border border-line min-h-[300px] flex items-center">
        <img
          src={IMG["hero-home"] || "/img/hero-luxury.jpg"}
          alt="Premium Luxury Collection"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/80 to-transparent" />
        <div className="relative p-8 md:p-10">
          <div className="text-xs tracking-[.25em] text-acc mb-3">
            PREMIUM COLLECTION
          </div>
          <h1 className="h1">
            Upgrade Your <span className="text-acc block">Wardrobe</span>
          </h1>
          <p className="text-mute mt-3 mb-6 max-w-sm">
            Discover curated fashion, accessories and footwear for every
            occasion.
          </p>
          <button
            onClick={() =>
              document
                .getElementById("arrivals")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="btn-p h-12"
          >
            Shop Now →
          </button>
        </div>
        <button
          onClick={() => setCO(true)}
          className="absolute top-5 right-5 btn-s h-10 bg-black/50 text-sm"
        >
          <ShoppingBag size={15} />
          Cart ({cart.length})
        </button>
      </div>
      <Section title="Shop by Category">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {shopCats.map(([n, im]) => (
            <button
              key={n}
              onClick={() => setCat(cat === n ? null : n)}
              className={`group tile relative aspect-[3/4] rounded-xl overflow-hidden border ${cat === n ? "border-acc" : "border-line"}`}
            >
              <img
                src={IMG[im] || getImg(im)}
                alt={n}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent" />
              <span className="absolute bottom-2 left-2 text-xs font-medium">
                {n}
              </span>
            </button>
          ))}
        </div>
      </Section>
      <Section title="Top Brands">
        <div className="flex gap-3 overflow-x-auto">
          {brands.map((b) => (
            <div
              key={b}
              className="card shrink-0 w-32 h-14 grid place-items-center font-serif font-bold tracking-wide hover:border-acc/50"
            >
              {b}
            </div>
          ))}
          <ChevronRight className="self-center text-acc" />
        </div>
      </Section>
      <div id="arrivals" />

      {/* ── Gender-Smart Women Outfit Showcase (top for female users) ── */}
      {womenOutfitStrip.length > 0 && isFemale && (
        <Section
          title="✨ Featured Women's Outfit Looks"
          sub={`${womenOutfitStrip.length} curated looks from dresses to ethnic wear — click to explore`}
          icon="Sparkles"
        >
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none">
            {womenOutfitStrip.map((l) => (
              <div
                key={l.id}
                className="shrink-0 w-44 group relative rounded-2xl overflow-hidden border border-line hover:border-acc/60 hover:-translate-y-1 transition-all shadow-lg bg-black/60 cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={l.img}
                    alt={l.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.onerror = null; e.target.src = IMG["hero-wardrobe"]; }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <div className="absolute bottom-0 p-3 w-full">
                  <p className="text-[11px] font-semibold text-white line-clamp-2 leading-tight">{l.title}</p>
                  <p className="text-[10px] text-acc mt-0.5 capitalize">{l.occ}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}


      <Section
        title="New Arrivals"
        right={
          <div className="flex items-center gap-2">
            {["All", "Men", "Accessories", "Jewelry"].map((x) => (
              <button
                key={x}
                onClick={() => setG(x)}
                className={`h-8 px-4 rounded-full text-xs ${g === x ? "bg-acc text-black" : "bg-card2 text-mute"}`}
              >
                {x}
              </button>
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {na.map((p) => (
            <P key={p.id} p={p} add={add} />
          ))}
        </div>
        {!na.length && (
          <p className="text-mute text-sm">No products match this filter.</p>
        )}
      </Section>
      <Section title="Trending Now" icon="Flame">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {trending.map((p) => (
            <P key={p.id} p={p} add={add} />
          ))}
        </div>
      </Section>

      {/* ── Gender-Smart Women Outfit Showcase (bottom for male / guest users) ── */}
      {womenOutfitStrip.length > 0 && !isFemale && (
        <Section
          title="✨ Featured Women's Outfit Looks"
          sub={`${womenOutfitStrip.length} curated looks from dresses to ethnic wear — scroll to explore`}
          icon="Sparkles"
        >
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none">
            {womenOutfitStrip.map((l) => (
              <div
                key={l.id}
                className="shrink-0 w-44 group relative rounded-2xl overflow-hidden border border-line hover:border-acc/60 hover:-translate-y-1 transition-all shadow-lg bg-black/60 cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={l.img}
                    alt={l.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.onerror = null; e.target.src = IMG["hero-wardrobe"]; }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <div className="absolute bottom-0 p-3 w-full">
                  <p className="text-[11px] font-semibold text-white line-clamp-2 leading-tight">{l.title}</p>
                  <p className="text-[10px] text-acc mt-0.5 capitalize">{l.occ}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <div className="grid md:grid-cols-3 gap-5 mt-12">
        {[
          ["Flat 40% OFF", "On Premium Shirts", "w-shirt-1"],
          ["Up to 30% OFF", "On Artisan Loafers", "w-other-2"],
          ["Flat 25% OFF", "On Chronograph Watches", "w-acc-1"],
        ].map(([a, b, im], i) => (
          <div
            key={a}
            className="relative overflow-hidden rounded-2xl border border-line p-6 min-h-[170px] bg-gradient-to-r from-acc/20 to-card"
          >
            <img
              src={IMG[im] || getImg(im)}
              alt=""
              className="absolute right-0 inset-y-0 w-1/2 h-full object-cover opacity-70"
            />
            <div className="relative">
              <div
                className={`font-serif text-2xl ${i == 2 ? "text-acc" : ""}`}
              >
                {a}
              </div>
              <div className="text-sm mb-4">{b}</div>
              <button
                onClick={() =>
                  document
                    .getElementById("arrivals")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="btn-p h-9 text-xs"
              >
                Shop Now →
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="card mt-8 p-6 grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          [Truck, "Free Shipping", "On orders above ₹999"],
          [ShieldCheck, "Easy Returns", "7-day return policy"],
          [BadgeCheck, "100% Authentic", "Genuine branded products"],
          [Headphones, "24/7 Support", "We’re here to help"],
        ].map(([I, a, b]) => (
          <div key={a} className="flex items-center gap-4">
            <I className="text-acc" size={28} />
            <div className="text-sm">
              <b className="block">{a}</b>
              <span className="text-mute text-xs">{b}</span>
            </div>
          </div>
        ))}
      </div>
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 card px-5 py-3 text-sm bg-[#111] border-acc/40 animate-up"
        >
          {toast}
        </div>
      )}
      <Modal
        open={cartOpen}
        onClose={() => setCO(false)}
        title={`Your Cart (${cart.length})`}
      >
        {cart.length ? (
          <>
            <div className="max-h-64 overflow-auto space-y-2 mb-4">
              {cart.map((p, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{p.name}</span>
                  <span>₹{p.price.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-medium mb-4">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <button onClick={() => setCO(false)} className="btn-p w-full">
              Checkout
            </button>
          </>
        ) : (
          <p className="text-mute text-sm">Your cart is empty.</p>
        )}
      </Modal>
    </div>
  );
}
