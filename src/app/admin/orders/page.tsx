'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  MessageCircle,
  Printer,
  Truck,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';

const COURIER_PARTNERS = [
  'Blue Dart Express',
  'Uttar Pradeshvery Surface',
  'DTDC Express',
  'India Post Speed Post',
  'Xpressbees',
  'Local Store Hand-Delivery / Self Pickup',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Tracking modal state
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [courierName, setCourierName] = useState(COURIER_PARTNERS[0]);
  const [trackingNumber, setTrackingNumber] = useState('');

  async function loadOrders() {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await loadOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      const res = await fetch(`/api/orders/${selectedOrder._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Shipped',
          tracking: {
            courier: courierName,
            trackingNumber: trackingNumber.trim(),
            trackingUrl: `https://www.google.com/search?q=${encodeURIComponent(`${courierName} tracking ${trackingNumber.trim()}`)}`,
          },
          note: `Dispatched with ${courierName} AWB: ${trackingNumber.trim()}`,
        }),
      });

      if (res.ok) {
        setSelectedOrder(null);
        setTrackingNumber('');
        await loadOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleWhatsApp = (order: any) => {
    const phone = order.customer?.phone?.replace(/[^0-9]/g, '');
    const cleanPhone = phone?.length === 10 ? `91${phone}` : phone;
    const msg = `Hello ${order.customer?.name}, this is Hindustan Computer. Regarding your Order #${order.orderNumber}:
Status: *${order.status}*
${order.tracking?.courier ? `Courier: ${order.tracking.courier}\nTracking AWB: ${order.tracking.trackingNumber}` : ''}
Thank you for shopping with Hindustan Computer!`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.phone?.includes(search);
    const matchStatus = statusFilter === 'all' || o.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Customer Orders Management
          </h1>
          <p className="text-xs text-slate-500">
            Total {orders.length} orders received from customer website
          </p>
        </div>

        {/* Status Filters Bar */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {['all', 'Pickup Requested', 'Stock Confirmed', 'Ready for Pickup', 'Collected & Paid', 'Out of Stock', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold capitalize transition ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by Order #, customer name, or 10-digit mobile number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">Order Details</th>
                <th className="p-3">Customer & Address</th>
                <th className="p-3">Products Ordered</th>
                <th className="p-3">Total (₹) & Payment</th>
                <th className="p-3">Order Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="max-w-sm mx-auto space-y-2">
                      <p className="font-bold text-slate-700 dark:text-slate-300">No Orders Yet</p>
                      <p className="text-xs text-slate-400">
                        Customer orders will appear here once customers place orders on your store website.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">No matching orders found.</td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono">
                      <strong className="text-sm font-bold text-blue-600 block">
                        {order.orderNumber}
                      </strong>
                      <span className="text-[10px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>

                    <td className="p-3 max-w-[200px]">
                      <strong className="block text-slate-900 dark:text-white truncate">
                        {order.customer?.name}
                      </strong>
                      <p className="text-slate-500 font-mono">{order.customer?.phone}</p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pinCode}
                      </p>
                    </td>

                    <td className="p-3">
                      <div className="space-y-1">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                            <span className="w-4 h-4 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px]">
                              {item.quantity}
                            </span>
                            <span className="truncate max-w-[180px] text-slate-700 dark:text-slate-300">
                              {item.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="p-3">
                      <strong className="text-sm font-black text-slate-900 dark:text-white block">
                        ₹{order.financials?.total.toLocaleString('en-IN')}
                      </strong>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {order.payment?.method}
                      </span>
                    </td>

                    <td className="p-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                          order.status === 'Collected & Paid'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : order.status === 'Ready for Pickup' || order.status === 'Stock Confirmed'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : order.status === 'Cancelled' || order.status === 'Out of Stock'
                            ? 'bg-red-50 text-red-700 border-red-300'
                            : 'bg-amber-50 text-amber-700 border-amber-300'
                        }`}
                      >
                        <option value="Pickup Requested">Pickup Requested</option>
                        <option value="Stock Confirmed">Stock Confirmed</option>
                        <option value="Ready for Pickup">Ready for Pickup</option>
                        <option value="Collected & Paid">Collected & Paid</option>
                        <option value="Out of Stock">Out of Stock</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      {/* Courier Tracking modal trigger */}
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setCourierName(order.tracking?.courier || COURIER_PARTNERS[0]);
                          setTrackingNumber(order.tracking?.trackingNumber || '');
                        }}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 text-blue-600 transition"
                        title="Set Courier AWB Tracking"
                      >
                        <Truck className="w-3.5 h-3.5" />
                      </button>

                      {/* WhatsApp Customer */}
                      <button
                        onClick={() => handleWhatsApp(order)}
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 transition"
                        title="Message Customer on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>

                      {/* Print Invoice */}
                      <Link
                        href={`/order-success/${order.orderNumber}`}
                        target="_blank"
                        className="inline-block p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
                        title="Print GST Bill"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Courier Tracking Assignment Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 space-y-4 shadow-2xl border">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              Dispatch Order #{selectedOrder.orderNumber}
            </h3>

            <p className="text-xs text-slate-500">
              Assign the courier company and tracking number. Customer will automatically be able to track their package.
            </p>

            <form onSubmit={handleSaveTracking} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Courier Partner *</label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                >
                  {COURIER_PARTNERS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">AWB / Consignment Tracking Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BD992834112IN"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                >
                  Save & Mark as Shipped
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
