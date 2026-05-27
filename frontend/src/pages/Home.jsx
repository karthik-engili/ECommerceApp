import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import api from '../api.js';
import ProductCard from '../components/ProductCard.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useApp();

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/products', { params: { search, category } });
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, category]);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 px-6 py-12 text-white shadow-xl shadow-brand-900/20 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-brand-400/10 blur-3xl"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm">
            New Arrivals
          </span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Discover Amazing Products at Unbeatable Prices
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-brand-100 sm:text-lg">
            Shop the latest electronics, wearables, and accessories. Fast delivery with cash on delivery available.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm font-medium text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="search-input"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm font-medium text-slate-700 shadow-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100 sm:w-52"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            id="category-filter"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Active filter pill */}
      {(search || category) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-500">Filters:</span>
          {search && (
            <span className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
              Search: "{search}"
              <button onClick={() => setSearch('')} className="hover:text-brand-900"><X size={12} /></button>
            </span>
          )}
          {category && (
            <span className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
              {category}
              <button onClick={() => setCategory('')} className="hover:text-brand-900"><X size={12} /></button>
            </span>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="skeleton aspect-[4/3]" />
              <div className="space-y-3 p-5">
                <div className="skeleton h-3 w-16" />
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-3 w-full" />
                <div className="flex items-center justify-between pt-2">
                  <div className="skeleton h-6 w-20" />
                  <div className="skeleton h-10 w-20 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <Search size={48} className="text-slate-300" />
          <h3 className="mt-4 text-lg font-bold text-slate-700">No products found</h3>
          <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              {category || 'All Products'}
              <span className="ml-2 text-sm font-medium text-slate-400">({products.length})</span>
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onAdd={addToCart} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
