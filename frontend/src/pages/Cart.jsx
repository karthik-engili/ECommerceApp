import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function Cart() {
  const { cart, total, updateQuantity, removeFromCart } = useApp();

  if (!cart.length) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
          <ShoppingBag size={40} className="text-slate-400" />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold text-slate-900">Your cart is empty</h1>
        <p className="mt-2 text-sm text-slate-500">Looks like you haven't added anything yet.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-200 transition-all hover:bg-brand-700"
        >
          <ShoppingBag size={16} /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900">
        Shopping Cart
        <span className="ml-2 text-base font-medium text-slate-400">({cart.length} items)</span>
      </h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Cart items */}
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="animate-fade-up flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-24 w-24 shrink-0 rounded-xl object-cover sm:h-28 sm:w-28"
              />
              <div className="flex-1 space-y-2">
                <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
                <p className="text-xs font-medium uppercase tracking-wider text-brand-600">{item.category}</p>
                <p className="text-lg font-extrabold text-slate-900">₹{item.price.toLocaleString('en-IN')}</p>
              </div>

              <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                {/* Quantity */}
                <div className="flex items-center gap-0 rounded-xl border border-slate-200 bg-slate-50">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-l-xl text-slate-600 transition-colors hover:bg-slate-200"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="flex h-9 w-10 items-center justify-center border-x border-slate-200 bg-white text-sm font-bold text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, Math.min(item.quantity + 1, item.stock))}
                    className="flex h-9 w-9 items-center justify-center rounded-r-xl text-slate-600 transition-colors hover:bg-slate-200"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:sticky lg:top-24">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900">Order Summary</h2>
            <div className="mt-5 space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-semibold text-slate-900">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Delivery</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <hr className="border-slate-100" />
              <div className="flex justify-between text-lg font-extrabold text-slate-900">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-200 transition-all hover:bg-brand-700 hover:shadow-xl"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
            <Link
              to="/"
              className="mt-3 block text-center text-sm font-medium text-slate-500 transition-colors hover:text-brand-600"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
