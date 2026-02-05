'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Truck,
  BarChart3,
  Settings,
} from 'lucide-react';

// Mock data - replace with actual API calls
const stats = [
  {
    label: 'Orders Today',
    value: '47',
    change: '+12%',
    icon: ShoppingCart,
    color: 'from-blue-500 to-cyan-600',
  },
  {
    label: 'Pending Approval',
    value: '8',
    change: '3 urgent',
    icon: Clock,
    color: 'from-amber-500 to-orange-600',
  },
  {
    label: 'Ready for Delivery',
    value: '23',
    change: 'Thu delivery',
    icon: Truck,
    color: 'from-green-500 to-emerald-600',
  },
  {
    label: 'Revenue (Week)',
    value: '₵12,450',
    change: '+8.2%',
    icon: DollarSign,
    color: 'from-purple-500 to-pink-600',
  },
];

const recentOrders = [
  {
    id: 'BFNG20260201',
    customer: 'Akua Mensah',
    items: 5,
    total: 245,
    status: 'IN_SOURCING',
    urgent: false,
  },
  {
    id: 'BFNG20260202',
    customer: 'Kofi Asante',
    items: 12,
    total: 580,
    status: 'SUBSTITUTION_REQUIRED',
    urgent: true,
  },
  {
    id: 'BFNG20260203',
    customer: 'Ama Owusu',
    items: 8,
    total: 320,
    status: 'PACKED',
    urgent: false,
  },
  {
    id: 'BFNG20260204',
    customer: 'Kwame Nkrumah School',
    items: 45,
    total: 2150,
    status: 'CONFIRMED',
    urgent: false,
  },
];

const statusColors: Record<string, string> = {
  RECEIVED: 'bg-gray-100 text-gray-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  IN_SOURCING: 'bg-yellow-100 text-yellow-800',
  SUBSTITUTION_REQUIRED: 'bg-orange-100 text-orange-800',
  PACKED: 'bg-green-100 text-green-800',
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
};

const bulkBuyingList = [
  { item: 'Garden Eggs', quantity: '45 kg', orders: 12, status: 'pending' },
  { item: 'Tomatoes', quantity: '78 kg', orders: 18, status: 'pending' },
  { item: 'Kontomire', quantity: '32 bunches', orders: 8, status: 'sourced' },
  { item: 'Onions', quantity: '65 kg', orders: 15, status: 'pending' },
];

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b-2 border-slate-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900">
                  BFNG Operations
                </h1>
                <p className="text-sm font-semibold text-slate-500">
                  Admin Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-slate-700 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">Admin User</p>
                  <p className="text-xs text-slate-500">Operations Manager</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b-2 border-slate-200">
        <div className="px-6">
          <nav className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'orders', label: 'Orders', icon: ShoppingCart },
              { id: 'sourcing', label: 'Bulk Sourcing', icon: Package },
              { id: 'deliveries', label: 'Deliveries', icon: Truck },
              { id: 'customers', label: 'Customers', icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all relative ${
                  selectedTab === tab.id
                    ? 'text-slate-900'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {selectedTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-md`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-black text-slate-900">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm"
              >
                <div className="p-6 border-b-2 border-slate-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900">
                      Recent Orders
                    </h2>
                    <button className="text-sm font-bold text-blue-600 hover:text-blue-700">
                      View All →
                    </button>
                  </div>
                </div>

                <div className="divide-y-2 divide-slate-100">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-6 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-black text-slate-900">
                              {order.id}
                            </p>
                            <p className="text-sm font-semibold text-slate-500">
                              {order.customer}
                            </p>
                          </div>
                        </div>
                        {order.urgent && (
                          <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                            <AlertCircle className="w-3 h-3" />
                            Urgent
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-semibold text-slate-600">
                            {order.items} items
                          </span>
                          <span className="font-black text-slate-900">
                            ₵{order.total}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            statusColors[order.status]
                          }`}
                        >
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Thursday Bulk Buying */}
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl border-2 border-orange-700 p-6 text-white shadow-lg mb-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-8 h-8" />
                  <div>
                    <p className="text-sm font-bold opacity-90">
                      Next Buying Cycle
                    </p>
                    <p className="text-2xl font-black">Thursday, Feb 6</p>
                  </div>
                </div>
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 rounded-xl font-bold transition-colors">
                  View Shopping List
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm"
              >
                <div className="p-6 border-b-2 border-slate-100">
                  <h3 className="text-lg font-black text-slate-900">
                    Bulk Shopping List
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {bulkBuyingList.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                    >
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          {item.item}
                        </p>
                        <p className="text-xs font-semibold text-slate-500">
                          {item.quantity} • {item.orders} orders
                        </p>
                      </div>
                      {item.status === 'sourced' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              {
                label: 'Process Substitutions',
                count: 8,
                color: 'from-orange-500 to-red-600',
              },
              {
                label: 'Assign Deliveries',
                count: 23,
                color: 'from-blue-500 to-cyan-600',
              },
              {
                label: 'Vendor Approvals',
                count: 3,
                color: 'from-purple-500 to-pink-600',
              },
              {
                label: 'Payment Issues',
                count: 2,
                color: 'from-green-500 to-emerald-600',
              },
            ].map((action, idx) => (
              <button
                key={idx}
                className="group relative bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-slate-300 hover:shadow-lg transition-all text-left"
              >
                <div
                  className={`absolute top-4 right-4 w-8 h-8 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center text-white font-black text-sm`}
                >
                  {action.count}
                </div>
                <p className="font-bold text-slate-900 pr-10">{action.label}</p>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  Requires attention
                </p>
              </button>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
