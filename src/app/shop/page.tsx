"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: string;
  stock: number;
  sizes: string[];
};

const categoryTabs = [
  { label: "All", value: "ALL" },
  { label: "Apparel", value: "APPAREL" },
  { label: "Accessories", value: "ACCESSORIES" },
  { label: "Equipment", value: "EQUIPMENT" },
  { label: "Other", value: "OTHER" },
];

const categoryEmoji: Record<string, string> = {
  APPAREL: "👕",
  ACCESSORIES: "🎒",
  EQUIPMENT: "🏓",
  OTHER: "📦",
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    fetch("/api/shop")
      .then((r) => r.json())
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTab === "ALL"
    ? products
    : products.filter((p) => p.category === activeTab);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>

      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Shop</h1>
            <p style={{ color: "#A0A3B1" }}>Equip yourself for success. Every purchase supports the club.</p>
          </div>
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="relative px-4 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-2"
            style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            🛒 Cart
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center text-white font-bold"
                style={{ background: "#3865FF" }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed right-4 top-24 z-50 w-80 rounded-xl shadow-2xl"
          style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid #2A2B3D" }}>
            <h3 className="font-semibold text-white">Your Cart</h3>
            <button onClick={() => setCartOpen(false)} style={{ color: "#A0A3B1" }}>✕</button>
          </div>
          {cart.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-2xl mb-2">🛒</p>
              <p className="text-sm" style={{ color: "#A0A3B1" }}>Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="p-4 flex flex-col gap-3 max-h-72 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">{item.product.name}</p>
                      <p className="text-xs" style={{ color: "#A0A3B1" }}>
                        £{item.product.price.toFixed(2)} × {item.qty}
                      </p>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)}
                      className="text-xs px-2 py-1 rounded-lg"
                      style={{ background: "rgba(255,77,106,0.15)", color: "#FF4D6A" }}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-4" style={{ borderTop: "1px solid #2A2B3D" }}>
                <div className="flex justify-between mb-3">
                  <span className="text-sm" style={{ color: "#A0A3B1" }}>Total</span>
                  <span className="text-white font-bold">£{cartTotal.toFixed(2)}</span>
                </div>
                <button
                  className="w-full py-2.5 rounded-xl text-sm font-medium text-white"
                  style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                  Checkout (coming soon)
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Tabs */}
      <section className="px-6 max-w-6xl mx-auto mb-8">
        <div className="flex gap-2 flex-wrap">
          {categoryTabs.map((tab) => (
            <button key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.value ? "#3865FF" : "#1A1B2E",
                color: activeTab === tab.value ? "#fff" : "#A0A3B1",
                border: "1px solid #2A2B3D",
              }}>
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="px-6 pb-16 max-w-6xl mx-auto">
        {loading ? (
          <div className="rounded-xl p-10 text-center" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <p className="text-sm" style={{ color: "#A0A3B1" }}>Loading products...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl p-10 text-center" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <p className="text-4xl mb-3">🛍️</p>
            <p className="text-white font-semibold mb-2">No products found</p>
            <p className="text-sm" style={{ color: "#A0A3B1" }}>
              {activeTab === "ALL" ? "Products will appear here once added." : "No products in this category yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((product) => {
              const inStock = product.stock > 0;
              const emoji = categoryEmoji[product.category] ?? "📦";

              return (
                <div key={product.id}
                  className="rounded-xl overflow-hidden transition-all hover:scale-105"
                  style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>

                  {/* Image area */}
                  <div className="h-36 flex items-center justify-center relative"
                    style={{ background: "#13141F", borderBottom: "1px solid #2A2B3D" }}>
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name}
                        className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl">{emoji}</span>
                    )}
                    {!inStock && (
                      <div className="absolute inset-0 flex items-center justify-center"
                        style={{ background: "rgba(12,13,20,0.7)" }}>
                        <span className="text-xs font-medium px-3 py-1 rounded-full"
                          style={{ background: "rgba(255,77,106,0.2)", color: "#FF4D6A" }}>
                          Out of stock
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="text-xs mb-1 capitalize" style={{ color: "#6B6E80" }}>
                      {product.category.toLowerCase()}
                    </p>
                    <h3 className="font-semibold text-white mb-1">{product.name}</h3>
                    {product.description && (
                      <p className="text-xs mb-4 line-clamp-2" style={{ color: "#A0A3B1" }}>
                        {product.description}
                      </p>
                    )}

                    {product.sizes.length > 0 && (
                      <div className="flex gap-1 flex-wrap mb-3">
                        {product.sizes.map((size) => (
                          <span key={size} className="text-xs px-1.5 py-0.5 rounded"
                            style={{ background: "#13141F", color: "#A0A3B1", border: "1px solid #2A2B3D" }}>
                            {size}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-white">£{product.price.toFixed(2)}</p>
                      <button
                        disabled={!inStock}
                        onClick={() => inStock && addToCart(product)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: inStock ? "linear-gradient(135deg, #3865FF, #7B2CFF)" : "#1F2038",
                          color: inStock ? "#fff" : "#6B6E80",
                          cursor: inStock ? "pointer" : "not-allowed",
                        }}>
                        {inStock ? "Add to Cart" : "Unavailable"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <footer className="px-6 py-8 border-t" style={{ borderColor: "#2A2B3D" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-semibold text-white">NovaClub</p>
          <div className="flex gap-6">
            {["Terms", "Privacy", "Cookies", "Contact"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm" style={{ color: "#6B6E80" }}>{item}</Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}