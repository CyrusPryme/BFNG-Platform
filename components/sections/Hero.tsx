import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Package, Truck, Users } from 'lucide-react'

// Custom featured products for the hero grid using bfngfiless webp images
const featuredProducts = [
  {
    id: 'hero-1',
    name: 'Fresh Produce',
    basePrice: 25.00,
    unit: 'basket',
    image: '/bfngfiless/fresh.webp'
  },
  {
    id: 'hero-2', 
    name: 'Quality Meats',
    basePrice: 45.00,
    unit: 'kg',
    image: '/bfngfiless/meat.webp'
  },
  {
    id: 'hero-3',
    name: 'Premium Grains',
    basePrice: 35.00,
    unit: 'sack',
    image: '/bfngfiless/grains.webp'
  },
  {
    id: 'hero-4',
    name: 'Pure Oils',
    basePrice: 55.00,
    unit: 'bottle',
    image: '/bfngfiless/oils.webp'
  }
]

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-ghana-green via-ghana-yellow to-ghana-red text-white">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Bulk Foods & Groceries Network
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-white/90">
              Fresh Ghanaian produce, bulk buying power, and convenient delivery. 
              Join thousands of households getting quality groceries at better prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/shop">
                <Button size="lg" className="bg-white text-ghana-green hover:bg-gray-100">
                  Start Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/subscriptions">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-ghana-green">
                  Subscribe & Save
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <Package className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">10,000+</div>
                <div className="text-sm text-white/80">Products</div>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">5,000+</div>
                <div className="text-sm text-white/80">Customers</div>
              </div>
              <div className="text-center">
                <Truck className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">Nationwide</div>
                <div className="text-sm text-white/80">Delivery</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-white/30">
                    <div className="aspect-[4/3] bg-gray-50 rounded-xl overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={200}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
