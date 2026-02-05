'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="flex gap-4 max-w-2xl">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search for fresh produce, groceries, and more..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ghana-green focus:border-transparent"
        />
      </div>
      <Button className="bg-ghana-green hover:bg-ghana-green/90 px-8">
        Search
      </Button>
    </div>
  )
}
