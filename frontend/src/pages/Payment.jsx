import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CreditCard,
  QrCode,
  Building2,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  ArrowLeft,
  Lock,
  ChevronRight,
  Package,
  Calendar,
  FileText,
  Sparkles,
} from "lucide-react";
import { useStore } from "../store.jsx";

export default function Payment() {
  const navigate = useNavigate();
  const { cart = [], clearCart, user } = useStore();

  // Delivery form state (pre-filled from user profile where available)
  const [address, setAddress] = useState({
    fullName: user?.name || "Sahil Khot",
    phone: user?.phone || "9876543210",
    street: "Flat 402, Highline Luxury Towers, Bandra West",
    city: user?.city || "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
  });

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiApp, setUpiApp] = useState("gpay");
  const [upiId, setUpiId] = useState("");
  const [cardData, setCardData] = useState({
    number: "4532 •••• •••• 8821",
    name: user?.name || "Sahil Khot",
    expiry: "09/28",
    cvv: "•••",
  });
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  // Flow states
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [viewOrderModal, setViewOrderModal] = useState(false);

  // Cart calculations
  const totalAmount = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0
  );

  const handlePayNow = () => {
    if (cart.length === 0 && !orderSuccess) return;

    setIsProcessing(true);

    setTimeout(() => {
      const generatedOrderId = `MMR-ORD-${Math.floor(
        100000 + Math.random() * 900000
      )}`;
      const orderData = {
        orderId: generatedOrderId,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        items: [...cart],
        amount: totalAmount,
        paymentMethod:
          paymentMethod === "upi"
            ? `UPI (${upiApp.toUpperCase()})`
            : paymentMethod === "card"
            ? "Credit / Debit Card"
            : paymentMethod === "netbanking"
            ? `Net Banking (${selectedBank})`
            : "Cash on Delivery",
        deliveryAddress: address,
      };

      // Save order record locally for persistence
      try {
        const pastOrders = JSON.parse(
          localStorage.getItem("mmr_past_orders") || "[]"
        );
        localStorage.setItem(
          "mmr_past_orders",
          JSON.stringify([orderData, ...pastOrders])
        );
      } catch (err) {
        console.warn("Could not save order locally:", err);
      }

      setPlacedOrder(orderData);
      clearCart();
      setIsProcessing(false);
      setOrderSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // SUCCESS STATE (POLISHED GREEN CONFIRMATION CARD / PAGE)
  // ─────────────────────────────────────────────────────────────────────────────
  if (orderSuccess && placedOrder) {
    return (
      <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 space-y-8 animate-up">
        {/* Polished Green Success Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0a2316] via-[#091b12] to-[#0c1410] border-2 border-emerald-500/80 text-center shadow-[0_0_60px_rgba(16,185,129,0.2)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Animated Green Badge */}
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 grid place-items-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-bounce-slow">
            <CheckCircle2 size={42} className="stroke-[2.5]" />
          </div>

          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-white mb-2 tracking-tight">
            Payment Successful ✓
          </h1>
          <p className="text-emerald-300 text-base sm:text-lg font-medium mb-6">
            Your order has been placed successfully
          </p>

          {/* Key Order Meta Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-black/40 border border-emerald-500/30 text-left max-w-xl mx-auto mb-6">
            <div>
              <div className="text-[11px] text-stone-400 uppercase font-semibold">
                Order ID
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                {placedOrder.orderId}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-stone-400 uppercase font-semibold">
                Total Paid
              </div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">
                ₹{placedOrder.amount.toLocaleString("en-IN")}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-stone-400 uppercase font-semibold">
                Payment
              </div>
              <div className="text-xs font-semibold text-white mt-0.5 truncate">
                {placedOrder.paymentMethod}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-stone-400 uppercase font-semibold">
                Estimated Delivery
              </div>
              <div className="text-xs font-bold text-amber-400 mt-0.5">
                3–5 Days
              </div>
            </div>
          </div>

          {/* Short Delivery Confirmation */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 max-w-xl mx-auto text-xs text-stone-300 space-y-1.5 mb-8 text-left">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Truck size={15} />
              <span>Delivery Address Confirmed</span>
            </div>
            <p className="pl-6 text-stone-300">
              {placedOrder.deliveryAddress.fullName} · +91{" "}
              {placedOrder.deliveryAddress.phone}
              <br />
              {placedOrder.deliveryAddress.street},{" "}
              {placedOrder.deliveryAddress.city},{" "}
              {placedOrder.deliveryAddress.state} -{" "}
              {placedOrder.deliveryAddress.pincode}
            </p>
            <p className="pl-6 text-stone-400 text-[11px] pt-1">
              A tracking link & official receipt have been dispatched to{" "}
              <span className="text-emerald-300 font-medium">
                {user?.email || "your email address"}
              </span>
              .
            </p>
          </div>

          {/* Action CTAs: View Order & Continue Shopping */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setViewOrderModal(true)}
              className="h-12 px-7 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition flex items-center gap-2 cursor-pointer"
            >
              <FileText size={16} />
              <span>View Order</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/shopping")}
              className="h-12 px-8 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-bold text-sm shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:brightness-110 transition flex items-center gap-2 cursor-pointer"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Modal: View Full Order Details */}
        {viewOrderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade">
            <div className="card max-w-xl w-full p-6 sm:p-8 bg-[#141414] border border-amber-500/30 rounded-3xl space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-serif font-bold text-xl text-white">
                    Order Details
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {placedOrder.orderId} · {placedOrder.date}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewOrderModal(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white grid place-items-center transition"
                >
                  ✕
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Purchased Items ({placedOrder.items.length})
                </div>
                {placedOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[.02] border border-white/[.06]"
                  >
                    <img
                      src={it.img || "/img/hero-wardrobe-luxury.jpg"}
                      alt={it.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-stone-400 uppercase">
                        {it.brand || "Make Me Ready"}
                      </div>
                      <div className="text-sm font-semibold text-white truncate">
                        {it.name}
                      </div>
                      <div className="text-xs text-amber-400 font-bold mt-0.5">
                        ₹{Number(it.price).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs space-y-2">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal</span>
                  <span>₹{placedOrder.amount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Shipping & Delivery</span>
                  <span className="text-emerald-400 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Goods & Services Tax (GST)</span>
                  <span>Included</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm text-white">
                  <span>Total Paid</span>
                  <span className="text-amber-400">
                    ₹{placedOrder.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewOrderModal(false)}
                className="btn-p w-full h-11 text-black font-semibold text-xs"
              >
                Close Order View
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // EMPTY CART CHECK
  // ─────────────────────────────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-5 animate-up">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 grid place-items-center mx-auto shadow-md">
          <ShoppingBag size={28} />
        </div>
        <h2 className="font-serif font-bold text-2xl text-white">
          Your Cart is Empty
        </h2>
        <p className="text-stone-400 text-sm leading-relaxed">
          There are no items currently queued for checkout. Browse our
          curated fashion collection to order pieces.
        </p>
        <Link
          to="/shopping"
          className="btn-p inline-flex items-center gap-2 h-11 px-6 text-xs text-black font-semibold"
        >
          <span>Explore Shopping Collection</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN CHECKOUT & PAYMENT PAGE
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-up">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-400 pt-1">
        <Link to="/home" className="hover:text-amber-400 transition">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link to="/shopping" className="hover:text-amber-400 transition">
          Shopping
        </Link>
        <ChevronRight size={12} />
        <span className="text-amber-400 font-semibold">Payment & Checkout</span>
      </div>

      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white">
          Secure <span className="text-amber-400">Payment & Order</span>
        </h1>
        <p className="text-stone-400 text-xs sm:text-sm mt-1">
          Review your selected pieces, verify delivery address, and complete your order.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Delivery Details & Payment Methods (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Delivery Address */}
          <div className="card p-6 bg-[#131313] border border-white/10 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 grid place-items-center">
                  <Truck size={16} />
                </span>
                <h2 className="font-serif font-bold text-base text-white">
                  1. Delivery Details
                </h2>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Free Express Delivery
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={address.fullName}
                  onChange={(e) =>
                    setAddress({ ...address, fullName: e.target.value })
                  }
                  className="inp text-xs"
                  placeholder="Recipient Name"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 uppercase mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                  className="inp text-xs"
                  placeholder="10-digit mobile number"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-stone-400 uppercase mb-1">
                  Delivery Address / Street
                </label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                  className="inp text-xs"
                  placeholder="Flat / House No., Apartment, Street"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 uppercase mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  className="inp text-xs"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 uppercase mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress({ ...address, pincode: e.target.value })
                  }
                  className="inp text-xs"
                  placeholder="PIN Code"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="card p-6 bg-[#131313] border border-white/10 rounded-3xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 grid place-items-center">
                  <Lock size={16} />
                </span>
                <h2 className="font-serif font-bold text-base text-white">
                  2. Payment Method
                </h2>
              </div>
              <span className="text-[11px] text-stone-400 flex items-center gap-1 font-medium">
                <ShieldCheck size={13} className="text-emerald-400" />
                256-bit SSL Secure
              </span>
            </div>

            {/* Payment Tabs Selection */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: "upi", label: "UPI", icon: QrCode, sub: "Instant 0% Fee" },
                { id: "card", label: "Cards", icon: CreditCard, sub: "Debit / Credit" },
                { id: "netbanking", label: "NetBanking", icon: Building2, sub: "All Banks" },
                { id: "cod", label: "Pay on Delivery", icon: Truck, sub: "Cash / Card" },
              ].map((m) => {
                const IconComp = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-amber-500/15 border-amber-400 text-white shadow-md shadow-amber-500/10"
                        : "bg-white/[.02] border-white/10 text-stone-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <IconComp
                      size={20}
                      className={isSelected ? "text-amber-400" : "text-stone-400"}
                    />
                    <div>
                      <div className="text-xs font-bold leading-tight">
                        {m.label}
                      </div>
                      <div className="text-[10px] text-stone-400 mt-0.5 font-medium">
                        {m.sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Payment Method Details Subform */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/[.08] space-y-3">
              {paymentMethod === "upi" && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-stone-300">
                    Choose UPI App or enter VPA ID:
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["gpay", "phonepe", "paytm"].map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setUpiApp(app)}
                        className={`h-10 rounded-xl text-xs font-semibold border uppercase transition ${
                          upiApp === app
                            ? "bg-amber-500 text-black border-amber-400"
                            : "bg-white/5 border-white/10 text-stone-300 hover:text-white"
                        }`}
                      >
                        {app === "gpay"
                          ? "Google Pay"
                          : app === "phonepe"
                          ? "PhonePe"
                          : "Paytm UPI"}
                      </button>
                    ))}
                  </div>
                  <div className="pt-2">
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Or Enter UPI ID (e.g. yourname@okhdfcbank)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="user@upi"
                      className="inp text-xs"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardData.number}
                      onChange={(e) =>
                        setCardData({ ...cardData, number: e.target.value })
                      }
                      className="inp text-xs"
                      placeholder="XXXX XXXX XXXX XXXX"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-400 font-medium mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={(e) =>
                          setCardData({ ...cardData, expiry: e.target.value })
                        }
                        className="inp text-xs"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 font-medium mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardData.cvv}
                        onChange={(e) =>
                          setCardData({ ...cardData, cvv: e.target.value })
                        }
                        className="inp text-xs"
                        placeholder="•••"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "netbanking" && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-stone-300">
                    Select Your Bank:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak"].map(
                      (b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setSelectedBank(b)}
                          className={`h-9 px-3 rounded-xl text-xs font-semibold border transition ${
                            selectedBank === b
                              ? "bg-amber-500 text-black border-amber-400"
                              : "bg-white/5 border-white/10 text-stone-300 hover:text-white"
                          }`}
                        >
                          {b}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="text-xs text-stone-300 leading-relaxed py-1">
                  Pay cash or scan QR upon physical delivery. Keep exact change
                  ready for faster checkout.
                </div>
              )}
            </div>

            {/* Trust Strip */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-stone-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Package size={14} className="text-amber-400 shrink-0" />
                <span>Direct Dispatch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary & Pay Now CTA (5 Cols) */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          <div className="card p-6 bg-[#141414] border border-amber-500/30 rounded-3xl shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-serif font-bold text-lg text-white">
                Order Summary
              </h2>
              <span className="text-xs font-bold text-amber-400">
                {cart.length} {cart.length === 1 ? "Item" : "Items"}
              </span>
            </div>

            {/* Selected Items Scroll List */}
            <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[.02] border border-white/[.06]"
                >
                  <img
                    src={item.img || "/img/hero-wardrobe-luxury.jpg"}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-stone-400 uppercase font-semibold">
                      {item.brand || "Exclusive"}
                    </div>
                    <div className="text-xs font-semibold text-white truncate">
                      {item.name}
                    </div>
                    <div className="text-xs font-bold text-amber-400 mt-0.5">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5 text-xs">
              <div className="flex justify-between text-stone-400">
                <span>Items Subtotal</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Delivery Charges</span>
                <span className="text-emerald-400 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Taxes & GST</span>
                <span className="text-stone-300">Included</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                <span className="font-semibold text-sm text-white">
                  Total Amount
                </span>
                <span className="font-serif font-bold text-xl text-amber-400">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Prominent Pay Now CTA */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={handlePayNow}
              className={`w-full h-13 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition duration-200 cursor-pointer shadow-lg ${
                isProcessing
                  ? "bg-amber-600/50 text-black cursor-wait"
                  : "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black hover:brightness-110 shadow-amber-500/25 ring-2 ring-amber-400/50"
              }`}
            >
              {isProcessing ? (
                <>
                  <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Processing Secure Payment...</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Pay ₹{totalAmount.toLocaleString("en-IN")} Now</span>
                </>
              )}
            </button>

            <div className="text-center">
              <Link
                to="/shopping"
                className="text-xs text-stone-400 hover:text-amber-400 transition inline-flex items-center gap-1 font-medium"
              >
                <ArrowLeft size={13} /> Return to Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
