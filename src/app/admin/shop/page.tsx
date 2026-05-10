"use client";

import { useState } from "react";

export default function AdminShopPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "APPAREL",
    stock: "",
    sizes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/shop/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        stock: parseInt(form.stock) || 0,
        sizes: form.sizes ? form.sizes.split(",").map((s) => s.trim()) : [],
        isActive: true,
      }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ name: "", description: "", price: "", category: "APPAREL", stock: "", sizes: "" });
      alert("Product created!");
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Shop</h1>
          <p className="text-gray-500 text-sm">Manage club shop products.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0C447C] transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">New Product</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Product name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="NovaClub T-Shirt" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]">
                <option value="APPAREL">Apparel</option>
                <option value="ACCESSORIES">Accessories</option>
                <option value="EQUIPMENT">Equipment</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Price (£) *</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="22" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Stock quantity *</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="50" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Sizes (comma separated, leave empty if no sizes)</label>
              <input name="sizes" value={form.sizes} onChange={handleChange} placeholder="S, M, L, XL, XXL" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Product description..." className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#185FA5] resize-none h-20" />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-[#185FA5] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0C447C] transition-colors"
          >
            Create Product
          </button>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="p-5">
          <p className="text-sm text-gray-500">Products will appear here once added.</p>
        </div>
      </div>
    </div>
  );
}