'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'

interface CartItem {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  product: {
    id: string
    name: string
    unit: string
    images: string[]
  }
}

export default function CartPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [subtotal, setSubtotal] = useState(0)
  const [deliveryFee] = useState(20)
  const [discount] = useState(0)

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    // Load cart from localStorage (in production, this would be from API)
    const savedCart = localStorage.getItem('bfng-cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCartItems(parsedCart)
        calculateSubtotal(parsedCart)
      } catch (error) {
        console.error('Error parsing cart:', error)
      }
    }
    setIsLoading(false)
  }, [session, router])

  const calculateSubtotal = (items: CartItem[]) => {
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0)
    setSubtotal(total)
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    const updatedItems = cartItems.map(item => {
      if (item.id === itemId) {
        const updatedItem = {
          ...item,
          quantity: newQuantity,
          totalPrice: item.unitPrice * newQuantity
        }
        return updatedItem
      }
      return item
    })

    setCartItems(updatedItems)
    calculateSubtotal(updatedItems)
    localStorage.setItem('bfng-cart', JSON.stringify(updatedItems))
  }

  const removeItem = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId)
    setCartItems(updatedItems)
    calculateSubtotal(updatedItems)
    localStorage.setItem('bfng-cart', JSON.stringify(updatedItems))
  }

  const clearCart = () => {
    setCartItems([])
    setSubtotal(0)
    localStorage.removeItem('bfng-cart')
  }

  const total = subtotal + deliveryFee - discount

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link href="/shop">
            <Button className="bg-ghana-green hover:bg-ghana-green/90">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <p className="text-gray-600">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    {item.product.images?.[0] ? (
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-2xl">🌱</span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-gray-600 text-sm">
                      GH₵{item.unitPrice.toFixed(2)} per {item.product.unit}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <div className="font-semibold text-lg">
                      GH₵{item.totalPrice.toFixed(2)}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Clear Cart Button */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Clear Cart
            </Button>
            <Link href="/shop">
              <Button variant="outline">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>GH₵{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>GH₵{deliveryFee.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-GH₵{discount.toFixed(2)}</span>
                </div>
              )}
              
              <hr />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>GH₵{total.toFixed(2)}</span>
              </div>

              <div className="space-y-2 pt-4">
                <Button className="w-full bg-ghana-green hover:bg-ghana-green/90">
                  Proceed to Checkout
                </Button>
                
                <div className="text-center text-sm text-gray-600">
                  <p>Free delivery on orders over GH₵200</p>
                  <p>Secure checkout powered by Paystack</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
