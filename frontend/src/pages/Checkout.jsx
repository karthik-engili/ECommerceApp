import { CreditCard, MapPin, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import { useApp } from '../context/AppContext.jsx';

export default function Checkout() {
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { cart, total, clearCart } = useApp();
  const navigate = useNavigate();

  const update = (field) => (e) =>
    setShippingAddress({ ...shippingAddress, [field]: e.target.value });

  const fieldLabels = {
    fullName: 'Full Name',
    address: 'Street Address',
    city: 'City',
    postalCode: 'Postal Code',
    country: 'Country'
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/orders', {
        items: cart.map((item) => ({ product: item._id, quantity: item.quantity })),
        shippingAddress,
        paymentMethod: 'Cash on Delivery'
      });
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Shipping form */}
        <form onSubmit={submit} className="space-y-6" id="checkout-form">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <MapPin size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Shipping Address</h2>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {Object.entries(fieldLabels).map(([key, label]) => (
                <div key={key} className={key === 'address' ? 'sm:col-span-2' : ''}>
                  <label htmlFor={`ship-${key}`} className="mb-1.5 block text-sm font-semibold text-slate-700">
                    {label}
                  </label>
                  <input
                    id={`ship-${key}`}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                    placeholder={label}
                    value={shippingAddress[key]}
                    onChange={update(key)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CreditCard size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Payment Method</h2>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-xl border-2 border-brand-200 bg-brand-50 px-5 py-4">
              <input type="radio" checked readOnly className="h-4 w-4 accent-brand-600" />
              <div>
                <p className="text-sm font-bold text-slate-900">Cash on Delivery</p>
                <p className="text-xs text-slate-500">Pay when your order arrives</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!cart.length || loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-4 text-sm font-bold text-white shadow-lg shadow-brand-200 transition-all hover:bg-brand-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 lg:hidden"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <ShieldCheck size={16} /> Place Order — ₹{total.toLocaleString('en-IN')}
              </>
            )}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div className="lg:sticky lg:top-24">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900">Order Summary</h2>

            <div className="mt-4 max-h-60 space-y-3 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-slate-900">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>

            <hr className="my-4 border-slate-100" />
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold">₹{total.toLocaleString('en-IN')}</span>
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

            <button
              type="submit"
              form="checkout-form"
              disabled={!cart.length || loading}
              className="mt-6 hidden w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-200 transition-all hover:bg-brand-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <ShieldCheck size={16} /> Place Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
