import { ClipboardList, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api.js';

const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Processing: 'bg-blue-100 text-blue-800 border-blue-200',
  Shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Cancelled: 'bg-red-100 text-red-800 border-red-200'
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const loadOrders = async () => {
    const { data } = await api.get('/orders');
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await api.patch(`/orders/${id}/status`, { status });
      loadOrders();
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton h-52 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-900">Manage Orders</h1>
        <span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700">
          {orders.length} orders
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <ClipboardList size={36} className="text-slate-400" />
          </div>
          <h3 className="mt-5 text-lg font-bold text-slate-700">No orders yet</h3>
          <p className="mt-1 text-sm text-slate-500">Orders will appear here when customers place them.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order._id}
              className="animate-fade-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 bg-slate-50 px-5 py-4 sm:items-center sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      #{order._id.slice(-6).toUpperCase()}
                      <span className="ml-2 font-medium text-slate-500">— {order.user?.name || 'Unknown'}</span>
                    </p>
                    <p className="text-xs text-slate-500">
                      {order.user?.email} •{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Status dropdown */}
                <div className="relative">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    disabled={updating === order._id}
                    className={`appearance-none rounded-full border py-1.5 pl-4 pr-8 text-xs font-bold outline-none transition-all focus:ring-2 focus:ring-brand-200 disabled:opacity-50 ${statusColors[order.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  {updating === order._id && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                    </div>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-slate-100 px-5 sm:px-6">
                {order.items.map((item) => (
                  <div key={item.product} className="flex items-center justify-between gap-3 py-3">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="h-9 w-9 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-5 py-3 sm:px-6">
                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Shipping:</span>{' '}
                  {order.shippingAddress?.fullName}, {order.shippingAddress?.city}, {order.shippingAddress?.country}
                </div>
                <p className="text-lg font-extrabold text-slate-900">₹{order.totalPrice.toLocaleString('en-IN')}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
