import { ShoppingCart, Star } from 'lucide-react';

export default function ProductCard({ product, onAdd }) {
  const inStock = product.stock > 0;

  return (
    <article className="animate-fade-up group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.featured && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-950 shadow-sm">
            <Star size={10} fill="currentColor" /> Featured
          </span>
        )}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
            <span className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-slate-900">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">
            {product.category}
          </span>
          <h3 className="mt-1 text-base font-bold leading-snug text-slate-900 sm:text-lg">
            {product.name}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500">
            {product.description}
          </p>
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
          <div>
            <p className="text-xl font-extrabold text-slate-900">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
            <p className={`mt-0.5 text-xs font-medium ${inStock ? 'text-emerald-600' : 'text-red-500'}`}>
              {inStock ? `${product.stock} in stock` : 'Unavailable'}
            </p>
          </div>
          <button
            disabled={!inStock}
            onClick={() => onAdd(product)}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-brand-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          >
            <ShoppingCart size={15} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </article>
  );
}
