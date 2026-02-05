'use client'

import { useState } from 'react'

export default function TestLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult('')

    try {
      const response = await fetch('/api/auth/simple-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(`✅ Login successful! User: ${data.user.firstName} ${data.user.lastName} (${data.user.role})`)
      } else {
        setResult(`❌ Login failed: ${data.error}`)
      }
    } catch (error) {
      setResult(`❌ Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">BFNG Login Test</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ghana-green"
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ghana-green"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-ghana-green text-white py-2 px-4 rounded-md hover:bg-ghana-green/90 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Login'}
          </button>
        </form>

        {result && (
          <div className="mt-6 p-4 rounded-md bg-gray-100">
            <pre className="text-sm">{result}</pre>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h3 className="font-semibold mb-2">Test Credentials:</h3>
          <div className="text-sm space-y-1">
            <p><strong>Admin:</strong> admin@bfng.com.gh / admin123</p>
            <p><strong>Customer:</strong> akua.mensah@gmail.com / customer123</p>
            <p><strong>Vendor:</strong> ghana.natural@example.com / vendor123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
