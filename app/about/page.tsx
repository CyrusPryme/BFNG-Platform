import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About BFNG - Bringing Nature to Your Doorstep',
  description: 'Learn about BFNG - Ghana\'s premier fresh produce delivery service connecting farmers directly to consumers.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-ghana-green text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About BFNG
            </h1>
            <p className="text-xl md:text-2xl text-green-100">
              Bringing Fresh Nature to Your Doorstep
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Our Story */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-4">
                BFNG (Bringing Fresh Nature) was born from a simple observation: 
                Ghanaians deserve access to fresh, high-quality produce without the 
                hassle of navigating crowded markets or worrying about food safety.
              </p>
              <p className="text-gray-700 mb-4">
                Founded in 2024, we started as a small operation connecting local farmers 
                in Accra with busy professionals who wanted fresh ingredients but lacked 
                the time for market runs. Today, we've grown into Ghana's trusted platform 
                for fresh produce delivery, serving thousands of customers across the country.
              </p>
              <p className="text-gray-700">
                Our mission is to bridge the gap between Ghana's rich agricultural heritage 
                and modern convenience, ensuring that fresh, nutritious food is accessible 
                to everyone, everywhere.
              </p>
            </div>
          </section>

          {/* Our Values */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-ghana-green text-3xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold mb-3">Freshness First</h3>
                <p className="text-gray-600">
                  We source directly from farms and markets daily, ensuring you get 
                  the freshest produce possible, often harvested the same day.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-ghana-green text-3xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold mb-3">Support Local</h3>
                <p className="text-gray-600">
                  We work directly with Ghanaian farmers and vendors, supporting 
                  local economies and ensuring fair prices for producers.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-ghana-green text-3xl mb-4">🚚</div>
                <h3 className="text-xl font-semibold mb-3">Convenience</h3>
                <p className="text-gray-600">
                  From market sourcing to doorstep delivery, we handle everything 
                  so you can focus on enjoying fresh, healthy meals.
                </p>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How BFNG Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-ghana-green text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  1
                </div>
                <h3 className="font-semibold mb-2">Browse & Order</h3>
                <p className="text-gray-600 text-sm">
                  Browse our selection of fresh produce and place your order online
                </p>
              </div>
              <div className="text-center">
                <div className="bg-ghana-green text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  2
                </div>
                <h3 className="font-semibold mb-2">We Source</h3>
                <p className="text-gray-600 text-sm">
                  Our shoppers visit markets and farms to source your items
                </p>
              </div>
              <div className="text-center">
                <div className="bg-ghana-green text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  3
                </div>
                <h3 className="font-semibold mb-2">Quality Check</h3>
                <p className="text-gray-600 text-sm">
                  We inspect and pack your items with care
                </p>
              </div>
              <div className="text-center">
                <div className="bg-ghana-green text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  4
                </div>
                <h3 className="font-semibold mb-2">Doorstep Delivery</h3>
                <p className="text-gray-600 text-sm">
                  Fresh produce delivered right to your doorstep
                </p>
              </div>
            </div>
          </section>

          {/* Team */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Leadership</h2>
            
            {/* CEO Section */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 mb-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <img 
                    src="/CEO.jpeg" 
                    alt="CEO of BFNG" 
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Naa Adobea Torkornoo</h3>
                  <h4 className="text-lg text-ghana-green font-semibold mb-4">CEO & Founder</h4>
                  <p className="text-gray-700 mb-4">
                    With over 15 years of experience in Ghana's agricultural sector and supply chain management, 
                    our CEO founded BFNG with a vision to revolutionize how Ghanaians access fresh produce. 
                    Having witnessed firsthand the challenges farmers face in getting fair prices and the 
                    struggles consumers have with accessing quality food, our leader is committed to creating 
                    a sustainable bridge between producers and consumers.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Under their leadership, BFNG has grown from a small startup to serving thousands of 
                    customers across Ghana, while maintaining our core values of freshness, fairness, 
                    and community support. Their passion for food security and sustainable agriculture 
                    drives our mission to make fresh, nutritious food accessible to every Ghanaian.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block bg-ghana-green text-white px-3 py-1 rounded-full text-sm">
                      Visionary Leader
                    </span>
                    <span className="inline-block bg-ghana-green text-white px-3 py-1 rounded-full text-sm">
                      Agriculture Expert
                    </span>
                    <span className="inline-block bg-ghana-green text-white px-3 py-1 rounded-full text-sm">
                      Community Advocate
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <p className="text-gray-700 text-center mb-6">
                BFNG is powered by a passionate team of food lovers, tech enthusiasts, 
                and logistics experts committed to revolutionizing Ghana's food delivery landscape.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="bg-gray-200 rounded-full w-24 h-24 mx-auto mb-4"></div>
                  <h3 className="font-semibold">Operations Team</h3>
                  <p className="text-gray-600 text-sm">Expert shoppers and quality controllers</p>
                </div>
                <div>
                  <div className="bg-gray-200 rounded-full w-24 h-24 mx-auto mb-4"></div>
                  <h3 className="font-semibold">Delivery Partners</h3>
                  <p className="text-gray-600 text-sm">Professional couriers ensuring timely delivery</p>
                </div>
                <div>
                  <div className="bg-gray-200 rounded-full w-24 h-24 mx-auto mb-4"></div>
                  <h3 className="font-semibold">Customer Support</h3>
                  <p className="text-gray-600 text-sm">Dedicated team ready to assist you</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center bg-ghana-green text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Ready to Experience Freshness?</h2>
            <p className="mb-6">Join thousands of Ghanaians enjoying fresh produce delivered to their doorstep.</p>
            <a 
              href="/shop" 
              className="inline-block bg-white text-ghana-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Shopping
            </a>
          </section>
        </div>
      </div>
    </div>
  )
}
