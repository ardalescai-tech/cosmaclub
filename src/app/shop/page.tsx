import Link from "next/link";
import { formatPrice } from "@/lib/utils";

const products = [
  {
    id: "1",
    name: "NovaClub T-Shirt",
    description: "Classic fit t-shirt with embroidered NovaClub logo. Available in S, M, L, XL.",
    price: 22,
    category: "APPAREL",
    emoji: "👕",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
  },
  {
    id: "2",
    name: "NovaClub Cap",
    description: "Adjustable snapback cap with embroidered logo. One size fits all.",
    price: 14,
    category: "APPAREL",
    emoji: "🧢",
    sizes: [],
    inStock: true,
  },
  {
    id: "3",
    name: "Club Tennis Bag",
    description: "Spacious racket bag with NovaClub branding. Fits up to 2 rackets.",
    price: 38,
    category: "ACCESSORIES",
    emoji: "🎒",
    sizes: [],
    inStock: true,
  },
  {
    id: "4",
    name: "Water Bottle",
    description: "500ml stainless steel water bottle with NovaClub logo.",
    price: 10,
    category: "ACCESSORIES",
    emoji: "🥤",
    sizes: [],
    inStock: true,
  },
  {
    id: "5",
    name: "Club Hoodie",
    description: "Warm pullover hoodie with NovaClub logo. Perfect for training days.",
    price: 35,
    category: "APPAREL",
    emoji: "🧥",
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
  },
  {
    id: "6",
    name: "Wristbands (pair)",
    description: "Terry cloth wristbands with NovaClub logo. One size fits all.",
    price: 6,
    category: "ACCESSORIES",
    emoji: "🎽",
    sizes: [],
    inStock: false,
  },
];

const categoryLabels: Record<string, string> = {
  APPAREL: "Apparel",
  ACCESSORIES: "Accessories",
  EQUIPMENT: "Equipment",
};

export default function ShopPage() {
  return (
    <main className="min-h-screen">
      <section className="bg-[#E6F1FB] px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-semibold text-[#0C447C] mb-2">Club Shop</h1>
          <p className="text-gray-600">
            Personalised NovaClub kit — every purchase supports the club directly.
          </p>
        </div>
      </section>

      <section className="px-6 py-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="bg-[#E6F1FB] h-40 flex items-center justify-center border-b border-gray-100">
                <span className="text-6xl">{product.emoji}</span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {categoryLabels[product.category]}
                  </span>
                  {!product.inStock && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                      Out of stock
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-3 flex-1">{product.description}</p>
                {product.sizes.length > 0 && (
                  <div className="flex gap-1 mb-3 flex-wrap">
                    {product.sizes.map((size) => (
                      <span key={size} className="text-xs border border-gray-200 px-2 py-0.5 rounded text-gray-600">
                        {size}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xl font-semibold text-[#0C447C]">{formatPrice(product.price)}</span>
                  <button
                    disabled={!product.inStock}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      product.inStock
                        ? "bg-[#185FA5] text-white hover:bg-[#0C447C]"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {product.inStock ? "Add to Cart" : "Unavailable"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#042C53] px-6 py-8 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-white font-semibold">NovaClub</p>
            <p className="text-white/50 text-sm">Non-profit community tennis club · Scotland</p>
          </div>
          <div className="flex gap-6">
            <Link href="/terms" className="text-white/50 text-sm hover:text-white">Terms</Link>
            <Link href="/privacy" className="text-white/50 text-sm hover:text-white">Privacy</Link>
            <Link href="/cookies" className="text-white/50 text-sm hover:text-white">Cookies</Link>
            <Link href="/contact" className="text-white/50 text-sm hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}