import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Calendar, Truck } from 'lucide-react'

const subscriptionPlans = [
  {
    id: 'weekly-fresh',
    name: 'Weekly Fresh Box',
    description: 'Perfect for small families',
    price: 150,
    frequency: 'Weekly',
    items: [
      'Mixed vegetables (5-7 items)',
      'Seasonal fruits (3-4 items)',
      'Fresh herbs',
      'Eggs (1 dozen)'
    ],
    features: [
      'Customizable preferences',
      'Skip any week',
      'Free delivery',
      'Substitution approvals'
    ],
    popular: true
  },
  {
    id: 'biweekly-family',
    name: 'Bi-Weekly Family Box',
    description: 'Great for larger families',
    price: 280,
    frequency: 'Bi-Weekly',
    items: [
      'Mixed vegetables (8-10 items)',
      'Seasonal fruits (5-6 items)',
      'Fresh herbs',
      'Eggs (2 dozen)',
      'Dairy products'
    ],
    features: [
      'Customizable preferences',
      'Skip any week',
      'Free delivery',
      'Substitution approvals',
      'Priority support'
    ],
    popular: false
  },
  {
    id: 'monthly-premium',
    name: 'Monthly Premium Box',
    description: 'For food enthusiasts',
    price: 450,
    frequency: 'Monthly',
    items: [
      'Premium vegetables (10-12 items)',
      'Exotic fruits (4-5 items)',
      'Fresh herbs',
      'Eggs (2 dozen)',
      'Artisanal products',
      'Made-in-Ghana specialties'
    ],
    features: [
      'Fully customizable',
      'Skip any week',
      'Free delivery',
      'Substitution approvals',
      'Priority support',
      'Exclusive products'
    ],
    popular: false
  }
]

export default function SubscriptionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Fresh Grocery Subscriptions</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get fresh, seasonal produce delivered regularly to your doorstep. 
          Customize your box and never run out of essentials again.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {subscriptionPlans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.popular ? 'border-ghana-green shadow-lg' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-ghana-green text-white">
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <p className="text-gray-600">{plan.description}</p>
              <div className="mt-4">
                <div className="text-4xl font-bold text-ghana-green">
                  GH₵{plan.price}
                </div>
                <div className="text-gray-500">per {plan.frequency.toLowerCase()}</div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">What's included:</h4>
                <ul className="space-y-2">
                  {plan.items.map((item, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-ghana-green mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-3">Features:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-ghana-green mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {plan.frequency} delivery
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <Truck className="h-4 w-4 mr-2" />
                  Free delivery
                </div>
              </div>

              <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                Choose {plan.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Card className="inline-block p-8 bg-gray-50">
          <CardContent className="p-0">
            <h3 className="text-xl font-bold mb-4">How Subscriptions Work</h3>
            <div className="grid md:grid-cols-4 gap-6 text-left">
              <div>
                <div className="w-8 h-8 bg-ghana-green text-white rounded-full flex items-center justify-center font-bold mb-2">
                  1
                </div>
                <h4 className="font-medium">Choose Plan</h4>
                <p className="text-sm text-gray-600">Select the perfect box for your needs</p>
              </div>
              <div>
                <div className="w-8 h-8 bg-ghana-green text-white rounded-full flex items-center justify-center font-bold mb-2">
                  2
                </div>
                <h4 className="font-medium">Customize</h4>
                <p className="text-sm text-gray-600">Tell us your preferences</p>
              </div>
              <div>
                <div className="w-8 h-8 bg-ghana-green text-white rounded-full flex items-center justify-center font-bold mb-2">
                  3
                </div>
                <h4 className="font-medium">Receive</h4>
                <p className="text-sm text-gray-600">Get fresh produce at your door</p>
              </div>
              <div>
                <div className="w-8 h-8 bg-ghana-green text-white rounded-full flex items-center justify-center font-bold mb-2">
                  4
                </div>
                <h4 className="font-medium">Enjoy</h4>
                <p className="text-sm text-gray-600">Cook with fresh, quality ingredients</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
