'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ShoppingCart, Package, Truck, Heart } from 'lucide-react'

const steps = [
  {
    id: 1,
    title: 'Browse & Order',
    description: 'Explore our fresh produce and place your order online or via WhatsApp',
    icon: ShoppingCart,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 2,
    title: 'We Source Fresh',
    description: 'Our team sources the best quality items from local markets and vendors',
    icon: Package,
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 3,
    title: 'Quick Delivery',
    description: 'Receive your order at your doorstep within our delivery schedule',
    icon: Truck,
    color: 'bg-orange-100 text-orange-600'
  },
  {
    id: 4,
    title: 'Enjoy & Repeat',
    description: 'Enjoy fresh, quality products and subscribe for regular deliveries',
    icon: Heart,
    color: 'bg-red-100 text-red-600'
  }
]

export function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How BFNG Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Getting fresh, quality groceries has never been easier. Here's how our platform works.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2" />
              )}
              
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center`}>
                      <step.icon className="h-8 w-8" />
                    </div>
                  </div>
                  
                  <div className="flex justify-center mb-3">
                    <div className="w-8 h-8 bg-ghana-green text-white rounded-full flex items-center justify-center font-bold">
                      {step.id}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Card className="inline-block p-6 bg-ghana-green text-white">
            <CardContent className="p-0">
              <h3 className="text-xl font-bold mb-2">
                Ready to get started?
              </h3>
              <p className="mb-4">
                Join thousands of satisfied customers getting fresh groceries delivered
              </p>
              <div className="flex gap-4 justify-center">
                <button className="bg-white text-ghana-green px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">
                  Start Shopping
                </button>
                <button className="border border-white px-6 py-2 rounded-md font-medium hover:bg-white hover:text-ghana-green transition-colors">
                  View Plans
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
