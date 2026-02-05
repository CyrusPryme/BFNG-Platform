import Link from 'next/link'
import { Facebook, Twitter, Instagram, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="/images/bfng-logo-hr1.jpg" 
                alt="BFNG Logo" 
                className="h-10 w-auto mr-2"
              />
            </div>
            <p className="text-gray-400 mb-4">
              Bulk Foods & Groceries Network - Connecting Ghanaian farmers and families with fresh, quality produce.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/shop" className="text-gray-400 hover:text-white">Shop</Link></li>
              <li><Link href="/subscriptions" className="text-gray-400 hover:text-white">Subscriptions</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-gray-400 hover:text-white">Help Center</Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-white">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-gray-400 hover:text-white">Returns</Link></li>
              <li><Link href="/payment" className="text-gray-400 hover:text-white">Payment Methods</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-ghana-green" />
                <span className="text-gray-400">+233 24 123 4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-ghana-green" />
                <span className="text-gray-400">info@bfng.com.gh</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 text-ghana-green mt-1" />
                <span className="text-gray-400">
                  Accra Central Market<br />
                  Accra, Ghana
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 BFNG - Bulk Foods & Groceries Network. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
