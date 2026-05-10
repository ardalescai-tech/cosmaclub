import Link from "next/link";

const products = [
  {
    id: "1",
    name: "Pro Carbon Paddle",
    description: "Professional grade carbon fiber paddle. Perfect for competitive play.",
    price: 69.99,
    category: "Equipment",
    emoji: "🏓",
    badge: "Best Seller",
    badgeColor: "#3865FF",
    inStock: true,
  },
  {
    id: "2",
    name: "Premium Rubber Set",
    description: "High-performance rubber sheets for advanced players.",
    price: 34.99,
    category: "Equipment",
    emoji: "🎯",
    badge: null,
    badgeColor: null,
    inStock: true,
  },
  {
    id: "3",
    name: "Training Balls (6x)",
    description: "Professional 3-star training balls. Pack of 6.",
    price: 12.99,
    category: "Accessories",
    emoji: "⚪",
    badge: "Popular",
    badgeColor: "#00D4AA",
    inStock: true,
  },
  {
    id: "4",
    name: "Sports Bag",
    description: "Spacious NovaClub branded sports bag with paddle compartment.",
    price: 44.99,
    category: "Accessories",
    emoji: "🎒",
    badge: null,
    badgeColor: null,
    inStock: true,
  },
  {
    id: "5",
    name: "NovaClub T-Shirt",
    description: "Classic fit t-shirt with embroidered NovaClub logo.",
    price: 22.00,
    category: "Apparel",
    emoji: "👕",
    badge: null,
    badgeColor: null,
    inStock: true,
  },
  {
    id: "6",
    name: "Club Hoodie",
    description: "Warm pullover hoodie with NovaClub logo.",
    price: 35.00,
    category: "Apparel",
    emoji: "🧥",
    badge: "New",
    badgeColor: "#7B2CFF",
    inStock: false,
  },
];

const tabs = ["All", "Paddles", "Rubbers", "Balls", "Accessories"];

export default function ShopPage() {
  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>

      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Shop</h1>
        <p style={{ color: "#A0A3B1" }}>Equip yourself for success. Every purchase supports the club.</p>
      </section>

      {/* TABS */}
      <section className="px-6 max-w-6xl mx-auto mb-8">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button key={tab}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: tab === "All" ? "#3865FF" : "#1A1B2E",
                color: tab === "All" ? "#fff" : "#A0A3B1",
                border: "1px solid #2A2B3D",
              }}>
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="px-6 pb-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="rounded-xl overflow-hidden transition-all hover:scale-105"
              style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>

              {/* Image area */}
              <div className="h-36 flex items-center justify-center relative"
                style={{ background: "#13141F", borderBottom: "1px solid #2A2B3D" }}>
                <span className="text-5xl">{product.emoji}</span>
                {product.badge && (
                  <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium text-white"
                    style={{ background: product.badgeColor! }}>
                    {product.badge}
                  </span>
                )}
                {!product.inStock && (
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
                <p className="text-xs mb-1" style={{ color: "#6B6E80" }}>{product.category}</p>
                <h3 className="font-semibold text-white mb-1">{product.name}</h3>
                <p className="text-xs mb-4" style={{ color: "#A0A3B1" }}>{product.description}</p>

                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-white">£{product.price.toFixed(2)}</p>
                  <button
                    disabled={!product.inStock}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all"
                    style={{
                      background: product.inStock ? "linear-gradient(135deg, #3865FF, #7B2CFF)" : "#1F2038",
                      color: product.inStock ? "#fff" : "#6B6E80",
                      cursor: product.inStock ? "pointer" : "not-allowed",
                    }}>
                    {product.inStock ? "Add to Cart" : "Unavailable"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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