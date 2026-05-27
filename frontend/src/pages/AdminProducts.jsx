import { ImagePlus, Package, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api.js';

const emptyProduct = { name: '', description: '', price: '', category: '', image: '', stock: '' };

const fieldConfig = {
  name: { label: 'Product Name', placeholder: 'e.g. Wireless Headphones', type: 'text' },
  description: { label: 'Description', placeholder: 'Brief product description', type: 'text' },
  price: { label: 'Price (₹)', placeholder: '0', type: 'number' },
  category: { label: 'Category', placeholder: 'e.g. Audio, Wearables', type: 'text' },
  image: { label: 'Image URL', placeholder: 'https://...', type: 'url' },
  stock: { label: 'Stock Quantity', placeholder: '0', type: 'number' }
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const loadProducts = async () => {
    const { data } = await api.get('/products');
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.post('/products', { ...form, price: Number(form.price), stock: Number(form.stock) });
      setForm(emptyProduct);
      loadProducts();
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    setDeleting(id);
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900">Manage Products</h1>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        {/* Add Form */}
        <form onSubmit={submit} className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <ImagePlus size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Add New Product</h2>
          </div>

          <div className="mt-6 space-y-4">
            {Object.entries(fieldConfig).map(([key, config]) => (
              <div key={key}>
                <label htmlFor={`prod-${key}`} className="mb-1.5 block text-sm font-semibold text-slate-700">
                  {config.label}
                </label>
                <input
                  id={`prod-${key}`}
                  type={config.type}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                  placeholder={config.placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  min={config.type === 'number' ? '0' : undefined}
                />
              </div>
            ))}
          </div>

          {/* Image Preview */}
          {form.image && (
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <img
                src={form.image}
                alt="Preview"
                className="h-36 w-full object-cover"
                onError={(e) => (e.target.style.display = 'none')}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-bold text-white shadow-lg shadow-brand-200 transition-all hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <Plus size={16} /> Add Product
              </>
            )}
          </button>
        </form>

        {/* Product List */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Table header */}
          <div className="hidden border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 sm:grid sm:grid-cols-[1fr_100px_100px_80px]">
            <span>Product</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Action</span>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package size={40} className="text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-500">No products yet. Add your first product.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="flex flex-col gap-3 px-5 py-4 sm:grid sm:grid-cols-[1fr_100px_100px_80px] sm:items-center"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.category}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">₹{product.price.toLocaleString('en-IN')}</p>
                  <p className={`text-sm font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {product.stock}
                  </p>
                  <button
                    onClick={() => remove(product._id)}
                    disabled={deleting === product._id}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    title="Delete"
                  >
                    {deleting === product._id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-300 border-t-red-600" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
