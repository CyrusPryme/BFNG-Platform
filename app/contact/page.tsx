'use client'

import { useState } from 'react'
import { Metadata } from 'next'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('')

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-ghana-green text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-green-100">
              We're here to help! Get in touch with our team.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              {submitStatus === 'success' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  Sorry, there was an error sending your message. Please try again.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                    placeholder="+233 XX XXX XXXX"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Issue</option>
                    <option value="delivery">Delivery Question</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                    <option value="technical">Technical Support</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-ghana-green text-white py-3 px-6 rounded-lg font-semibold hover:bg-ghana-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="text-ghana-green text-2xl">📍</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Office Location</h3>
                      <p className="text-gray-600">
                        BFNG Headquarters<br />
                        123 Accra Central Market Road<br />
                        Accra, Ghana<br />
                        P.O. Box AN 12345, Accra North
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="text-ghana-green text-2xl">📞</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Phone Numbers</h3>
                      <p className="text-gray-600">
                        Main: +233 30 123 4567<br />
                        Customer Care: +233 50 123 4567<br />
                        WhatsApp: +233 55 123 4567
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="text-ghana-green text-2xl">✉️</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Email Addresses</h3>
                      <p className="text-gray-600">
                        General: info@bfng.com.gh<br />
                        Support: support@bfng.com.gh<br />
                        Orders: orders@bfng.com.gh<br />
                        Partnerships: partners@bfng.com.gh
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="text-ghana-green text-2xl">🕐</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
                      <p className="text-gray-600">
                        Monday - Friday: 6:00 AM - 8:00 PM<br />
                        Saturday: 6:00 AM - 6:00 PM<br />
                        Sunday: 8:00 AM - 2:00 PM<br />
                        <span className="text-sm text-ghana-green font-medium">Customer Care: 24/7</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="bg-ghana-green text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-ghana-green/90 transition-colors">
                    f
                  </a>
                  <a href="#" className="bg-ghana-green text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-ghana-green/90 transition-colors">
                    𝕏
                  </a>
                  <a href="#" className="bg-ghana-green text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-ghana-green/90 transition-colors">
                    📷
                  </a>
                  <a href="#" className="bg-ghana-green text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-ghana-green/90 transition-colors">
                    in
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">How do I place an order?</h3>
                <p className="text-gray-600 text-sm">
                  Simply browse our products, add items to your cart, and checkout. We'll handle the rest!
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">What are your delivery hours?</h3>
                <p className="text-gray-600 text-sm">
                  We deliver from 7 AM to 8 PM Monday-Saturday, and 8 AM to 2 PM on Sundays.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Do you deliver to my area?</h3>
                <p className="text-gray-600 text-sm">
                  We currently serve Accra, Tema, Kumasi, and surrounding areas. Check your location at checkout.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">How fresh is your produce?</h3>
                <p className="text-gray-600 text-sm">
                  All our produce is sourced fresh daily from local markets and farms, often harvested the same day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
