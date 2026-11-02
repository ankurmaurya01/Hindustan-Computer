'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  IndianRupee,
  ShoppingCart,
  Package,
  AlertTriangle,
  Clock,
  PlusCircle,
  MessageCircle,
  Printer,
  ChevronRight,
  TrendingUp,
  Truck,
  CheckCircle2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  async function loadDashboardData() {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/orders'),
      ]);
      const statsData = await statsRes.json();
      const ordersData = await ordersRes.json();
      setStats(statsData);
      setOrders(ordersData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setStatusUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await loadDashboardData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleWhatsAppCustomer = (order: any) => {
    const phone = order.customer?.phone?.replace(/[^0-9]/g, '');
    const cleanPhone = phone?.length === 10 ? `91${phone}` : phone;
    const msg = `Hello ${order.customer?.name}, this is Hindustan Computer. Regarding your order #${order.orderNumber} (Amount: ₹${order.financials?.total.toLocaleString('en-IN')}) - your current order status is: *${order.status}*. Let us know if you have any questions!`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (loading) {
    return <div className="p-8 text-sm text-slate-500">Loading shopkeeper dashboard data...</div>;
  }

  const kpi = stats?.kpi || {
    totalRevenue: 0,
    todayRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    lowStockCount: 0,
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Shopkeeper Overview
          </h1>
          <p className="text-xs text-slate-500">
            Welcome to Hindustan Computer control panel. Manage all products, stock, and customer orders from here.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold shadow-sm transition hover:bg-slate-50"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-600" />
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* 4 Big KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Sales Revenue
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
              ₹{kpi.totalRevenue?.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real store orders</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Orders
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
              {kpi.totalOrders}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {kpi.completedOrders || 0} delivered safely
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Pending Dispatch
            </span>
            <span className="text-2xl font-black text-amber-500 mt-1 block">
              {kpi.pendingOrders}
            </span>
            <span className="text-[11px] text-amber-600 font-bold mt-1 block">
              Needs packing / courier pickup
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Total Products & Low Stock Alert */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Catalog & Stock
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
              {kpi.totalProducts} Products
            </span>
            <span className="text-[11px] text-red-500 font-bold mt-1 block">
              {kpi.lowStockCount || 0} low in stock
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-slate-500">
              Update shipment status and message customer on WhatsApp directly
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3 rounded-l-xl">Order #</th>
                <th className="p-3">Customer & Phone</th>
                <th className="p-3">Items</th>
                <th className="p-3">Amount & Payment</th>
                <th className="p-3">Change Status</th>
                <th className="p-3 rounded-r-xl text-right">Shopkeeper Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No orders placed yet. Orders will appear here as customers buy items.
                  </td>
                </tr>
              ) : (
                orders.slice(0, 6).map((order) => (
                <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-blue-600">
                    {order.orderNumber}
                  </td>
                  <td className="p-3">
                    <strong className="block text-slate-800 dark:text-slate-100">
                      {order.customer?.name}
                    </strong>
                    <span className="text-slate-400">{order.customer?.phone}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold block text-slate-700 dark:text-slate-300">
                      {order.items?.length || 1} item(s)
                    </span>
                    <span className="text-[11px] text-slate-400 truncate max-w-[180px] block">
                      {order.items?.[0]?.name}
                    </span>
                  </td>
                  <td className="p-3">
                    <strong className="text-sm font-extrabold text-slate-900 dark:text-white block">
                      ₹{order.financials?.total.toLocaleString('en-IN')}
                    </strong>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {order.payment?.method}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      disabled={statusUpdating === order._id}
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : order.status === 'Shipped'
                          ? 'bg-blue-50 text-blue-700 border-blue-300'
                          : order.status === 'Cancelled'
                          ? 'bg-red-50 text-red-700 border-red-300'
                          : 'bg-amber-50 text-amber-700 border-amber-300'
                      }`}
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Payment Confirmed">Payment Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3 text-right space-x-1.5">
                    <button
                      onClick={() => handleWhatsAppCustomer(order)}
                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 transition"
                      title="WhatsApp Customer"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/order-success/${order.orderNumber}`}
                      target="_blank"
                      className="inline-block p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                      title="Print Invoice"
                    >
                      <Printer className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Warning Alert Box for Shopkeeper */}
      {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>Shop Inventory Warning: Products Running Low on Stock</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {stats.lowStockProducts.slice(0, 6).map((item: any) => (
              <div key={item._id} className="p-3 bg-white dark:bg-slate-900 rounded-2xl border text-xs flex justify-between items-center">
                <div className="truncate mr-2">
                  <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{item.name}</p>
                  <p className="text-slate-400 text-[10px]">SKU: {item.sku}</p>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-700 font-black rounded-lg text-xs shrink-0">
                  {item.stock} Left
                </span>
              </div>
            ))}
          </div>
          <div className="pt-1">
            <Link
              href="/admin/products"
              className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
            >
              Update stock quantities in Product Manager &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
