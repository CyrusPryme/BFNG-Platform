'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Search, 
  ChevronRight, 
  Star,
  TrendingUp,
  Box,
  Truck,
  Calendar
} from 'lucide-react';

// Mock data - replace with actual API calls
const featuredProducts = [
  {
    id: '1',
    name: 'Fresh Garden Eggs',
    price: 25,
    unit: 'per kg',
    image: '/products/garden-eggs.jpg',
    category: 'Fresh Vegetables',
    inStock: true,
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Kontomire (Cocoyam Leaves)',
    price: 15,
    unit: 'per bunch',
    image: '/products/kontomire.jpg',
    category: 'Fresh Vegetables',
    inStock: true,
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Nkontomire Powder',
    price: 45,
    unit: 'per 500g',
    image: '/products/powder.jpg',
    category: 'Made in Ghana',
    inStock: true,
    rating: 4.7,
    vendor: 'Ghana Natural',
  },
];

const categories = [
  { name: 'Fresh Vegetables', icon: '🥬', color: '#16a34a' },
  { name: 'Fruits', icon: '🍊', color: '#ea580c' },
  { name: 'Grains & Cereals', icon: '🌾', color: '#ca8a04' },
  { name: 'Made in Ghana', icon: '🇬🇭', color: '#dc2626' },
  { name: 'Proteins', icon: '🥩', color: '#7c2d12' },
  { name: 'Dairy', icon: '🥛', color: '#0284c7' },
];

export default function CustomerStorefront() {
  const [cart, setCart] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const addToCart = (product: any) => {
    setCart([...cart, product]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-emerald-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b-4 border-black shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-red-600 via-yellow-500 to-green-600 rounded-2xl flex items-center justify-center transform rotate-6 shadow-lg">
                <Box className="w-8 h-8 text-white transform -rotate-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-gray-900">
                  BFNG
                </h1>
                <p className="text-xs font-bold text-gray-600 tracking-wide">
                  BULK. FRESH. GHANA.
                </p>
              </div>
            </motion.div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for fresh produce, Made-in-Ghana products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 border-2 border-transparent rounded-2xl focus:border-black focus:bg-white transition-all outline-none text-sm font-medium"
                />
              </div>
            </div>

            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Cart</span>
              {cart.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                >
                  {cart.length}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 py-20">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6"
            >
              <p className="text-white font-black text-sm tracking-widest">
                🇬🇭 PROUDLY GHANAIAN
              </p>
            </motion.div>

            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
              Fresh from<br />
              <span className="text-black">Ghana's Markets</span>
              <br />to Your Door
            </h2>

            <p className="text-xl md:text-2xl text-white/90 font-bold max-w-3xl mx-auto mb-10">
              Bulk groceries • Weekly deliveries • Made-in-Ghana products
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, rotate: -1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-2"
              >
                Start Shopping
                <ChevronRight className="w-6 h-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/90 backdrop-blur text-black px-10 py-5 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-6 h-6" />
                Subscribe & Save
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-10 left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"
        />
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: 'Bulk Pricing',
                description: 'Save more when you buy in bulk',
                color: 'from-green-500 to-emerald-600',
              },
              {
                icon: Truck,
                title: 'Weekly Delivery',
                description: 'Fresh deliveries every Thursday-Friday',
                color: 'from-yellow-500 to-orange-600',
              },
              {
                icon: Star,
                title: 'Made in Ghana',
                description: 'Support local producers',
                color: 'from-red-500 to-pink-600',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border-2 border-black shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div
                  className={`absolute top-6 right-6 w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center transform rotate-6 group-hover:rotate-12 transition-transform shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white transform -rotate-6 group-hover:-rotate-12 transition-transform" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 font-bold">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Shop by Category
            </h2>
            <div className="w-24 h-2 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="group relative bg-white p-6 rounded-3xl border-2 border-black shadow-lg hover:shadow-xl transition-all overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                  style={{ backgroundColor: category.color }}
                />
                <div className="text-5xl mb-3">{category.icon}</div>
                <h3 className="text-sm font-black text-gray-900 leading-tight">
                  {category.name}
                </h3>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                Fresh This Week
              </h2>
              <div className="w-24 h-2 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 rounded-full" />
            </div>
            <button className="hidden md:flex items-center gap-2 text-black font-black hover:gap-4 transition-all">
              View All
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-black shadow-lg hover:shadow-2xl transition-all overflow-hidden"
              >
                {/* Product Image */}
                <div className="aspect-square bg-gradient-to-br from-amber-100 to-emerald-100 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">
                    🥬
                  </div>
                  {product.vendor && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-yellow-500 text-white px-4 py-2 rounded-full text-xs font-black shadow-lg">
                      🇬🇭 MADE IN GHANA
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-black text-gray-500 uppercase tracking-wide mb-1">
                        {product.category}
                      </p>
                      <h3 className="text-xl font-black text-gray-900">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-100 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 text-amber-600 fill-current" />
                      <span className="text-sm font-black text-amber-900">
                        {product.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-black text-black">
                        ₵{product.price}
                      </p>
                      <p className="text-sm font-bold text-gray-500">
                        {product.unit}
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addToCart(product)}
                      className="bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                    >
                      <ShoppingCart className="w-6 h-6" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Subscribe & Never Run Out
            </h2>
            <p className="text-xl text-gray-300 font-bold mb-10 max-w-2xl mx-auto">
              Set up your weekly grocery box and save 15%. Pause or edit anytime.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 text-white px-12 py-6 rounded-2xl font-black text-xl shadow-2xl hover:shadow-3xl transition-all inline-flex items-center gap-3"
            >
              Get Started
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t-4 border-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-black mb-4">BFNG</h3>
              <p className="text-gray-400 font-bold">
                Ghana's premier bulk grocery and Made-in-Ghana marketplace.
              </p>
            </div>
            <div>
              <h4 className="font-black mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400 font-bold">
                <li>Fresh Produce</li>
                <li>Made in Ghana</li>
                <li>Subscriptions</li>
                <li>Bulk Orders</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 font-bold">
                <li>About Us</li>
                <li>Become a Vendor</li>
                <li>Delivery Info</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 font-bold">
                <li>Help Center</li>
                <li>Track Order</li>
                <li>Returns</li>
                <li>WhatsApp: +233 XX XXX XXXX</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 font-bold">
              © 2026 BFNG. Proudly Ghanaian. 🇬🇭
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
