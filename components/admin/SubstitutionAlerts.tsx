'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Check, X, MessageSquare } from 'lucide-react'

const substitutionAlerts = [
  {
    id: 'SUB-001',
    orderId: 'ORD-002',
    customer: 'Kofi Asante',
    originalItem: 'Fresh Tomatoes (5kg)',
    suggestedItem: 'Ripe Tomatoes (4kg)',
    priceDifference: -5.50,
    urgency: 'urgent',
    timeWaiting: '2 hours'
  },
  {
    id: 'SUB-002',
    orderId: 'ORD-005',
    customer: 'Ama Osei',
    originalItem: 'Plantain (3 bunches)',
    suggestedItem: 'Green Plantain (4 bunches)',
    priceDifference: 3.00,
    urgency: 'normal',
    timeWaiting: '4 hours'
  }
]

export function SubstitutionAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          Substitution Approvals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {substitutionAlerts.map((alert) => (
            <div key={alert.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant={alert.urgency === 'urgent' ? 'destructive' : 'secondary'}>
                    {alert.urgency}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    Waiting {alert.timeWaiting}
                  </span>
                </div>
                <span className="text-sm font-medium">{alert.orderId}</span>
              </div>
              
              <div className="mb-3">
                <div className="text-sm font-medium mb-1">{alert.customer}</div>
                <div className="text-xs text-gray-600 line-through">
                  {alert.originalItem}
                </div>
                <div className="text-xs text-green-600">
                  → {alert.suggestedItem}
                </div>
                <div className={`text-xs font-medium ${
                  alert.priceDifference > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {alert.priceDifference > 0 ? '+' : ''}GH₵{Math.abs(alert.priceDifference).toFixed(2)}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button size="sm" variant="ghost">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <Button variant="outline" className="w-full">
            View All Substitutions
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
