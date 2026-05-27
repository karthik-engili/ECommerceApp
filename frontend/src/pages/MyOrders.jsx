import { ClipboardList, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api.js';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Processing: 'bg-blue-100 text-blue-800 border-blue-200',
  Shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Cancelled: 'bg-red-100 text-red-800 border-red-200'
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/orders/my-orders')
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-40" />
        {[...Array(2)].map((_, i) => (
          <div key={i} className="skeleton h-48 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900">My Orders</h1>

      {orders.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <ClipboardList size={36} className="text-slate-400" />
          </div>
          <h3 className="mt-5 text-lg font-bold text-slate-700">No orders yet</h3>
          <p className="mt-1 text-sm text-slate-500">Your order history will appear here once you place an order.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order._id}
              className="animate-fade-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Order #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusColors[order.status] || 'bg-slate-100 text-slate-600'}`}>
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="divide-y divide-slate-100 px-5 sm:px-6">
                {order.items.map((item) => (
                  <div key={item.product} className="flex items-center justify-between gap-3 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3.5 sm:px-6">
                <span className="text-sm text-slate-500">Total Amount</span>
                <span className="text-lg font-extrabold text-slate-900">₹{order.totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
