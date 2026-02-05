'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users, Package, AlertTriangle } from 'lucide-react'

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Operations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Order Cutoff</h3>
              <p className="text-2xl font-bold text-orange-600">Wednesday 11:59 PM</p>
              <p className="text-sm text-gray-600">2 days, 14 hours remaining</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Bulk Buying Day</h3>
              <p className="text-2xl font-bold text-ghana-green">Thursday</p>
              <p className="text-sm text-gray-600">47 orders queued</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Delivery Schedule</h3>
              <p className="text-2xl font-bold text-blue-600">Thu - Fri</p>
              <p className="text-sm text-gray-600">32 deliveries planned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Action Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div>
                  <p className="font-medium">8 substitutions pending approval</p>
                  <p className="text-sm text-gray-600">Customer responses required</p>
                </div>
              </div>
              <Button size="sm">Review</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="font-medium">3 payments failed</p>
                  <p className="text-sm text-gray-600">Customer action needed</p>
                </div>
              </div>
              <Button size="sm">Handle</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="font-medium">5 items out of stock</p>
                  <p className="text-sm text-gray-600">Update inventory</p>
                </div>
              </div>
              <Button size="sm">Update</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
