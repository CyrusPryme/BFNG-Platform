import { Suspense } from 'react'
import { Hero } from '@/components/sections/Hero'
import { FeaturedProducts } from '@/components/sections/FeaturedProducts'
import { Categories } from '@/components/sections/Categories'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Testimonials } from '@/components/sections/Testimonials'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <HowItWorks />
      <Testimonials />
    </div>
  )
}
