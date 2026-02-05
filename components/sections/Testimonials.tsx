'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Ama Mensah',
    location: 'Accra',
    role: 'Regular Customer',
    content: 'BFNG has completely changed how I shop for groceries. The quality is always fresh and the delivery is always on time. Highly recommend!',
    rating: 5,
    avatar: '👩‍🦰'
  },
  {
    id: 2,
    name: 'Kofi Asante',
    location: 'Kumasi',
    role: 'Subscription Customer',
    content: 'The weekly subscription service is perfect for my family. We get fresh produce regularly without having to think about it. Great service!',
    rating: 5,
    avatar: '👨‍💼'
  },
  {
    id: 3,
    name: 'Adwoa Serwaa',
    location: 'Tema',
    role: 'Diaspora Customer',
    content: 'I order for my parents in Ghana from the UK. The process is seamless and my parents always receive fresh quality items. Thank you BFNG!',
    rating: 5,
    avatar: '👩‍⚕️'
  }
]

export function Testimonials() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust BFNG for their fresh grocery needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-ghana-green/20 rounded-full flex items-center justify-center text-2xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                    <p className="text-xs text-ghana-green">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 italic">
                  "{testimonial.content}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Card className="inline-block p-8 bg-gradient-to-r from-ghana-green/10 to-ghana-yellow/10">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-ghana-green mb-2">5,000+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-ghana-green mb-2">4.9/5</div>
                  <div className="text-gray-600">Average Rating</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-ghana-green mb-2">10,000+</div>
                  <div className="text-gray-600">Orders Delivered</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
